-- Create workspaces table
CREATE TABLE IF NOT EXISTS workspaces (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('restaurant', 'cafe', 'bar', 'catering')),
  location TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  description TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  capacity INTEGER,
  cuisine TEXT,
  rating DECIMAL(2,1) DEFAULT 0,
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create workspace_metrics table for storing real-time metrics
CREATE TABLE IF NOT EXISTS workspace_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  metric_type TEXT NOT NULL CHECK (metric_type IN ('daily_revenue', 'staff_productivity', 'menu_performance', 'customer_satisfaction')),
  value DECIMAL(10,2) NOT NULL,
  change_percentage DECIMAL(5,2) DEFAULT 0,
  trend TEXT DEFAULT 'neutral' CHECK (trend IN ('up', 'down', 'neutral')),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create workspace_activities table for tracking activities
CREATE TABLE IF NOT EXISTS workspace_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  description TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create workspace_alerts table for managing alerts
CREATE TABLE IF NOT EXISTS workspace_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('warning', 'info', 'success', 'error')),
  message TEXT NOT NULL,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  is_read BOOLEAN DEFAULT FALSE,
  data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_workspaces_user_id ON workspaces(user_id);
CREATE INDEX IF NOT EXISTS idx_workspaces_status ON workspaces(status);
CREATE INDEX IF NOT EXISTS idx_workspaces_type ON workspaces(type);
CREATE INDEX IF NOT EXISTS idx_workspaces_last_active ON workspaces(last_active);

CREATE INDEX IF NOT EXISTS idx_workspace_metrics_workspace_id ON workspace_metrics(workspace_id);
CREATE INDEX IF NOT EXISTS idx_workspace_metrics_type ON workspace_metrics(metric_type);
CREATE INDEX IF NOT EXISTS idx_workspace_metrics_date ON workspace_metrics(date);

CREATE INDEX IF NOT EXISTS idx_workspace_activities_workspace_id ON workspace_activities(workspace_id);
CREATE INDEX IF NOT EXISTS idx_workspace_activities_user_id ON workspace_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_workspace_activities_created_at ON workspace_activities(created_at);

CREATE INDEX IF NOT EXISTS idx_workspace_alerts_workspace_id ON workspace_alerts(workspace_id);
CREATE INDEX IF NOT EXISTS idx_workspace_alerts_type ON workspace_alerts(type);
CREATE INDEX IF NOT EXISTS idx_workspace_alerts_is_read ON workspace_alerts(is_read);
CREATE INDEX IF NOT EXISTS idx_workspace_alerts_created_at ON workspace_alerts(created_at);

-- Create triggers for updated_at
CREATE TRIGGER update_workspaces_updated_at BEFORE UPDATE ON workspaces
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workspace_alerts_updated_at BEFORE UPDATE ON workspace_alerts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update workspace last_active
CREATE OR REPLACE FUNCTION update_workspace_last_active()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE workspaces SET last_active = NOW() WHERE id = NEW.workspace_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update workspace last_active when activity is created
CREATE TRIGGER trigger_workspace_activity
  AFTER INSERT ON workspace_activities
  FOR EACH ROW EXECUTE FUNCTION update_workspace_last_active();

-- Function to create default metrics for new workspace
CREATE OR REPLACE FUNCTION create_default_metrics()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO workspace_metrics (workspace_id, metric_type, value, change_percentage, trend)
  VALUES 
    (NEW.id, 'daily_revenue', 0, 0, 'neutral'),
    (NEW.id, 'staff_productivity', 0, 0, 'neutral'),
    (NEW.id, 'menu_performance', 0, 0, 'neutral'),
    (NEW.id, 'customer_satisfaction', 0, 0, 'neutral');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create default metrics for new workspace
CREATE TRIGGER trigger_workspace_default_metrics
  AFTER INSERT ON workspaces
  FOR EACH ROW EXECUTE FUNCTION create_default_metrics(); 