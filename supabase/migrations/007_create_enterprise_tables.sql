-- Create enterprise tables for multi-tenant architecture and advanced features

-- Tenants table
CREATE TABLE IF NOT EXISTS tenants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  domain VARCHAR(255) UNIQUE NOT NULL,
  plan VARCHAR(50) NOT NULL DEFAULT 'basic' CHECK (plan IN ('basic', 'professional', 'enterprise')),
  status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'cancelled')),
  settings JSONB NOT NULL DEFAULT '{}',
  limits JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action VARCHAR(255) NOT NULL,
  resource VARCHAR(255) NOT NULL,
  resource_id VARCHAR(255),
  details JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Compliance reports table
CREATE TABLE IF NOT EXISTS compliance_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  report_type VARCHAR(50) NOT NULL CHECK (report_type IN ('gdpr', 'security', 'data_retention', 'access_logs')),
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  data JSONB NOT NULL DEFAULT '{}',
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Enterprise analytics table
CREATE TABLE IF NOT EXISTS enterprise_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  period VARCHAR(20) NOT NULL CHECK (period IN ('daily', 'weekly', 'monthly', 'quarterly', 'yearly')),
  metrics JSONB NOT NULL DEFAULT '{}',
  trends JSONB NOT NULL DEFAULT '{}',
  insights TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscription plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price_monthly DECIMAL(10,2) NOT NULL,
  price_yearly DECIMAL(10,2) NOT NULL,
  features TEXT[] NOT NULL DEFAULT '{}',
  limits JSONB NOT NULL DEFAULT '{}',
  max_tenants INTEGER,
  support_level VARCHAR(50) NOT NULL DEFAULT 'basic' CHECK (support_level IN ('basic', 'priority', 'dedicated')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tenant subscriptions table
CREATE TABLE IF NOT EXISTS tenant_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  plan_id VARCHAR(50) NOT NULL REFERENCES subscription_plans(id),
  status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'past_due', 'unpaid')),
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- White-label configurations table
CREATE TABLE IF NOT EXISTS white_label_configs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  css TEXT,
  branding JSONB NOT NULL DEFAULT '{}',
  custom_domain VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Advanced reports table
CREATE TABLE IF NOT EXISTS advanced_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  report_type VARCHAR(50) NOT NULL CHECK (report_type IN ('financial', 'operational', 'marketing', 'comprehensive')),
  data JSONB NOT NULL DEFAULT '{}',
  insights TEXT[] DEFAULT '{}',
  date_range JSONB NOT NULL DEFAULT '{}',
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant_id ON audit_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs(resource);

CREATE INDEX IF NOT EXISTS idx_compliance_reports_tenant_id ON compliance_reports(tenant_id);
CREATE INDEX IF NOT EXISTS idx_compliance_reports_type ON compliance_reports(report_type);
CREATE INDEX IF NOT EXISTS idx_compliance_reports_status ON compliance_reports(status);

CREATE INDEX IF NOT EXISTS idx_enterprise_analytics_tenant_id ON enterprise_analytics(tenant_id);
CREATE INDEX IF NOT EXISTS idx_enterprise_analytics_period ON enterprise_analytics(period);
CREATE INDEX IF NOT EXISTS idx_enterprise_analytics_created_at ON enterprise_analytics(created_at);

CREATE INDEX IF NOT EXISTS idx_tenant_subscriptions_tenant_id ON tenant_subscriptions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_subscriptions_plan_id ON tenant_subscriptions(plan_id);
CREATE INDEX IF NOT EXISTS idx_tenant_subscriptions_status ON tenant_subscriptions(status);

CREATE INDEX IF NOT EXISTS idx_white_label_configs_tenant_id ON white_label_configs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_advanced_reports_tenant_id ON advanced_reports(tenant_id);
CREATE INDEX IF NOT EXISTS idx_advanced_reports_type ON advanced_reports(report_type);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON tenants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscription_plans_updated_at BEFORE UPDATE ON subscription_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tenant_subscriptions_updated_at BEFORE UPDATE ON tenant_subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_white_label_configs_updated_at BEFORE UPDATE ON white_label_configs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE white_label_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE advanced_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tenants
CREATE POLICY "Users can view their own tenant" ON tenants
  FOR SELECT USING (id IN (
    SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid()
  ));

CREATE POLICY "Tenant owners can update their tenant" ON tenants
  FOR UPDATE USING (id IN (
    SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid() AND role = 'owner'
  ));

-- RLS Policies for audit_logs
CREATE POLICY "Users can view audit logs for their tenant" ON audit_logs
  FOR SELECT USING (tenant_id IN (
    SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid()
  ));

CREATE POLICY "System can insert audit logs" ON audit_logs
  FOR INSERT WITH CHECK (true);

-- RLS Policies for compliance_reports
CREATE POLICY "Users can view compliance reports for their tenant" ON compliance_reports
  FOR SELECT USING (tenant_id IN (
    SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid()
  ));

-- RLS Policies for enterprise_analytics
CREATE POLICY "Users can view analytics for their tenant" ON enterprise_analytics
  FOR SELECT USING (tenant_id IN (
    SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid()
  ));

-- RLS Policies for tenant_subscriptions
CREATE POLICY "Users can view subscriptions for their tenant" ON tenant_subscriptions
  FOR SELECT USING (tenant_id IN (
    SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid()
  ));

-- RLS Policies for white_label_configs
CREATE POLICY "Users can view white label configs for their tenant" ON white_label_configs
  FOR SELECT USING (tenant_id IN (
    SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid()
  ));

-- RLS Policies for advanced_reports
CREATE POLICY "Users can view advanced reports for their tenant" ON advanced_reports
  FOR SELECT USING (tenant_id IN (
    SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid()
  ));

-- Insert default subscription plans
INSERT INTO subscription_plans (id, name, price_monthly, price_yearly, features, limits, support_level) VALUES
('basic', 'Basic', 29.00, 290.00, 
 ARRAY['Up to 5 users', '100 menu items', 'Basic AI assistant', 'Email support'],
 '{"users": 5, "menu_items": 100, "storage_gb": 1, "api_calls_per_month": 1000, "ai_requests_per_month": 500, "custom_integrations": 0}',
 'basic'),
('professional', 'Professional', 99.00, 990.00,
 ARRAY['Up to 25 users', '500 menu items', 'Advanced AI features', 'Multi-location support', 'API access', 'Priority support'],
 '{"users": 25, "menu_items": 500, "storage_gb": 10, "api_calls_per_month": 10000, "ai_requests_per_month": 5000, "custom_integrations": 5}',
 'priority'),
('enterprise', 'Enterprise', 299.00, 2990.00,
 ARRAY['Unlimited users', 'Unlimited menu items', 'White-label solution', 'Custom integrations', 'Advanced analytics', 'Dedicated support', 'SLA guarantee'],
 '{"users": -1, "menu_items": -1, "storage_gb": 100, "api_calls_per_month": 100000, "ai_requests_per_month": 50000, "custom_integrations": -1}',
 'dedicated')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price_monthly = EXCLUDED.price_monthly,
  price_yearly = EXCLUDED.price_yearly,
  features = EXCLUDED.features,
  limits = EXCLUDED.limits,
  support_level = EXCLUDED.support_level,
  updated_at = NOW();
