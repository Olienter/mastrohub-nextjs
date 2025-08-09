import { createHash, randomBytes, createCipheriv, createDecipheriv } from 'crypto';

// Security Interfaces
export interface SecurityEvent {
  id: string;
  timestamp: Date;
  userId: string;
  action: string;
  resource: string;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  details?: Record<string, any>;
}

export interface AuditLog {
  id: string;
  timestamp: Date;
  userId: string;
  action: string;
  resource: string;
  oldValue?: any;
  newValue?: any;
  metadata: Record<string, any>;
}

export interface GDPRConsent {
  id: string;
  userId: string;
  consentType: 'data_collection' | 'marketing' | 'analytics' | 'third_party';
  granted: boolean;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
}

export interface SecurityPolicy {
  id: string;
  name: string;
  description: string;
  category: 'password' | 'session' | 'data' | 'access' | 'compliance';
  rules: SecurityRule[];
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SecurityRule {
  id: string;
  name: string;
  condition: string;
  action: 'allow' | 'deny' | 'warn' | 'log';
  priority: number;
}

export interface ThreatDetection {
  id: string;
  timestamp: Date;
  threatType: 'brute_force' | 'sql_injection' | 'xss' | 'csrf' | 'ddos' | 'suspicious_activity';
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  details: Record<string, any>;
  mitigated: boolean;
  mitigationAction?: string;
}

export interface DataEncryption {
  id: string;
  dataType: 'user_data' | 'financial_data' | 'menu_data' | 'analytics_data';
  encryptionMethod: 'AES-256' | 'RSA-2048';
  encryptedAt: Date;
  keyId: string;
  status: 'encrypted' | 'decrypted' | 'pending';
}

// Security Service Class
export class SecurityService {
  private static instance: SecurityService;
  private securityEvents: SecurityEvent[] = [];
  private auditLogs: AuditLog[] = [];
  private gdprConsents: GDPRConsent[] = [];
  private securityPolicies: SecurityPolicy[] = [];
  private threatDetections: ThreatDetection[] = [];
  private dataEncryptions: DataEncryption[] = [];

  private constructor() {
    this.initializeDefaultPolicies();
    this.initializeMockData();
  }

  public static getInstance(): SecurityService {
    if (!SecurityService.instance) {
      SecurityService.instance = new SecurityService();
    }
    return SecurityService.instance;
  }

  // Encryption Methods
  public encryptData(data: string, key: string): string {
    const algorithm = 'aes-256-cbc';
    const iv = randomBytes(16);
    const cipher = createCipheriv(algorithm, key, iv);
    
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return iv.toString('hex') + ':' + encrypted;
  }

  public decryptData(encryptedData: string, key: string): string {
    const algorithm = 'aes-256-cbc';
    const parts = encryptedData.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    
    const decipher = createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }

  public hashPassword(password: string): string {
    return createHash('sha256').update(password).digest('hex');
  }

  // Security Event Logging
  public logSecurityEvent(event: Omit<SecurityEvent, 'id' | 'timestamp'>): SecurityEvent {
    const securityEvent: SecurityEvent = {
      ...event,
      id: this.generateId(),
      timestamp: new Date()
    };
    
    this.securityEvents.push(securityEvent);
    return securityEvent;
  }

  // Audit Logging
  public logAuditEvent(audit: Omit<AuditLog, 'id' | 'timestamp'>): AuditLog {
    const auditLog: AuditLog = {
      ...audit,
      id: this.generateId(),
      timestamp: new Date()
    };
    
    this.auditLogs.push(auditLog);
    return auditLog;
  }

  // GDPR Compliance
  public recordConsent(consent: Omit<GDPRConsent, 'id' | 'timestamp'>): GDPRConsent {
    const gdprConsent: GDPRConsent = {
      ...consent,
      id: this.generateId(),
      timestamp: new Date()
    };
    
    this.gdprConsents.push(gdprConsent);
    return gdprConsent;
  }

  public getUserConsents(userId: string): GDPRConsent[] {
    return this.gdprConsents.filter(consent => consent.userId === userId);
  }

  public deleteUserData(userId: string): boolean {
    // Mock data deletion
    this.gdprConsents = this.gdprConsents.filter(consent => consent.userId !== userId);
    this.auditLogs = this.auditLogs.filter(log => log.userId !== userId);
    this.securityEvents = this.securityEvents.filter(event => event.userId !== userId);
    
    return true;
  }

  // Security Policies
  public getSecurityPolicies(): SecurityPolicy[] {
    return this.securityPolicies;
  }

  public createSecurityPolicy(policy: Omit<SecurityPolicy, 'id' | 'createdAt' | 'updatedAt'>): SecurityPolicy {
    const newPolicy: SecurityPolicy = {
      ...policy,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.securityPolicies.push(newPolicy);
    return newPolicy;
  }

  public updateSecurityPolicy(id: string, updates: Partial<SecurityPolicy>): SecurityPolicy | null {
    const policyIndex = this.securityPolicies.findIndex(policy => policy.id === id);
    if (policyIndex === -1) return null;
    
    this.securityPolicies[policyIndex] = {
      ...this.securityPolicies[policyIndex],
      ...updates,
      updatedAt: new Date()
    };
    
    return this.securityPolicies[policyIndex];
  }

  // Threat Detection
  public detectThreat(threat: Omit<ThreatDetection, 'id' | 'timestamp'>): ThreatDetection {
    const threatDetection: ThreatDetection = {
      ...threat,
      id: this.generateId(),
      timestamp: new Date()
    };
    
    this.threatDetections.push(threatDetection);
    return threatDetection;
  }

  public getThreatDetections(limit: number = 50): ThreatDetection[] {
    return this.threatDetections
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  public mitigateThreat(threatId: string, action: string): boolean {
    const threat = this.threatDetections.find(t => t.id === threatId);
    if (!threat) return false;
    
    threat.mitigated = true;
    threat.mitigationAction = action;
    return true;
  }

  // Data Encryption
  public encryptSensitiveData(dataType: DataEncryption['dataType'], data: any): DataEncryption {
    const encryption: DataEncryption = {
      id: this.generateId(),
      dataType,
      encryptionMethod: 'AES-256',
      encryptedAt: new Date(),
      keyId: this.generateId(),
      status: 'encrypted'
    };
    
    this.dataEncryptions.push(encryption);
    return encryption;
  }

  public getEncryptionStatus(): DataEncryption[] {
    return this.dataEncryptions;
  }

  // Security Analytics
  public getSecurityAnalytics() {
    const now = new Date();
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const recentEvents = this.securityEvents.filter(event => event.timestamp >= last30Days);
    const recentThreats = this.threatDetections.filter(threat => threat.timestamp >= last30Days);
    
    return {
      totalEvents: this.securityEvents.length,
      recentEvents: recentEvents.length,
      totalThreats: this.threatDetections.length,
      recentThreats: recentThreats.length,
      threatsBySeverity: this.groupBySeverity(recentThreats),
      eventsByType: this.groupByType(recentEvents),
      complianceStatus: this.getComplianceStatus(),
      encryptionStatus: this.getEncryptionStatus()
    };
  }

  // Compliance Status
  public getComplianceStatus() {
    return {
      gdpr: {
        compliant: true,
        dataRetention: 'configured',
        userConsents: this.gdprConsents.length,
        dataDeletion: 'available'
      },
      security: {
        policiesActive: this.securityPolicies.filter(p => p.enabled).length,
        encryptionEnabled: true,
        auditLogging: true,
        threatDetection: true
      },
      access: {
        roleBasedAccess: true,
        sessionManagement: true,
        passwordPolicy: true
      }
    };
  }

  // Helper Methods
  private generateId(): string {
    return randomBytes(16).toString('hex');
  }

  private groupBySeverity(threats: ThreatDetection[]) {
    return threats.reduce((acc, threat) => {
      acc[threat.severity] = (acc[threat.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private groupByType(events: SecurityEvent[]) {
    return events.reduce((acc, event) => {
      acc[event.action] = (acc[event.action] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private initializeDefaultPolicies() {
    const defaultPolicies: Omit<SecurityPolicy, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        name: 'Password Policy',
        description: 'Enforce strong password requirements',
        category: 'password',
        rules: [
          {
            id: this.generateId(),
            name: 'Minimum Length',
            condition: 'password.length >= 8',
            action: 'deny',
            priority: 1
          },
          {
            id: this.generateId(),
            name: 'Complexity Requirements',
            condition: 'password.matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)/)',
            action: 'deny',
            priority: 2
          }
        ],
        enabled: true
      },
      {
        name: 'Session Management',
        description: 'Control session timeouts and security',
        category: 'session',
        rules: [
          {
            id: this.generateId(),
            name: 'Session Timeout',
            condition: 'session.duration > 3600',
            action: 'warn',
            priority: 1
          }
        ],
        enabled: true
      },
      {
        name: 'Data Access Control',
        description: 'Control access to sensitive data',
        category: 'access',
        rules: [
          {
            id: this.generateId(),
            name: 'Role-based Access',
            condition: 'user.role.hasPermission(resource)',
            action: 'allow',
            priority: 1
          }
        ],
        enabled: true
      }
    ];

    defaultPolicies.forEach(policy => {
      this.createSecurityPolicy(policy);
    });
  }

  private initializeMockData() {
    // Mock security events
    const mockEvents: Omit<SecurityEvent, 'id' | 'timestamp'>[] = [
      {
        userId: 'user1',
        action: 'login',
        resource: '/auth/login',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        success: true
      },
      {
        userId: 'user2',
        action: 'data_access',
        resource: '/api/analytics',
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        success: true
      },
      {
        userId: 'user3',
        action: 'failed_login',
        resource: '/auth/login',
        ipAddress: '192.168.1.102',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        success: false,
        details: { reason: 'Invalid credentials' }
      }
    ];

    mockEvents.forEach(event => {
      this.logSecurityEvent(event);
    });

    // Mock GDPR consents
    const mockConsents: Omit<GDPRConsent, 'id' | 'timestamp'>[] = [
      {
        userId: 'user1',
        consentType: 'data_collection',
        granted: true,
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      {
        userId: 'user1',
        consentType: 'marketing',
        granted: false,
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    ];

    mockConsents.forEach(consent => {
      this.recordConsent(consent);
    });

    // Mock threat detections
    const mockThreats: Omit<ThreatDetection, 'id' | 'timestamp'>[] = [
      {
        threatType: 'brute_force',
        severity: 'medium',
        source: '192.168.1.102',
        details: { attempts: 5, timeWindow: '5 minutes' },
        mitigated: false
      },
      {
        threatType: 'suspicious_activity',
        severity: 'low',
        source: '192.168.1.103',
        details: { activity: 'Multiple rapid requests' },
        mitigated: true,
        mitigationAction: 'Rate limiting applied'
      }
    ];

    mockThreats.forEach(threat => {
      this.detectThreat(threat);
    });

    // Mock data encryptions
    const mockEncryptions: Omit<DataEncryption, 'id' | 'encryptedAt'>[] = [
      {
        dataType: 'user_data',
        encryptionMethod: 'AES-256',
        keyId: this.generateId(),
        status: 'encrypted'
      },
      {
        dataType: 'financial_data',
        encryptionMethod: 'AES-256',
        keyId: this.generateId(),
        status: 'encrypted'
      }
    ];

    mockEncryptions.forEach(encryption => {
      this.dataEncryptions.push({
        ...encryption,
        id: this.generateId(),
        encryptedAt: new Date()
      });
    });
  }
}

export const securityService = SecurityService.getInstance();

// Security hardening and monitoring for production launch
export class SecurityManager {
  private static instance: SecurityManager;
  private securityEvents: SecurityEvent[] = [];
  private rateLimitMap: Map<string, RateLimitInfo> = new Map();

  static getInstance(): SecurityManager {
    if (!SecurityManager.instance) {
      SecurityManager.instance = new SecurityManager();
    }
    return SecurityManager.instance;
  }

  // Input sanitization
  sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  }

  // XSS Protection
  validateXSS(input: string): boolean {
    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
      /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
      /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi
    ];

    return !xssPatterns.some(pattern => pattern.test(input));
  }

  // SQL Injection Protection
  validateSQLInjection(input: string): boolean {
    const sqlPatterns = [
      /(\b(union|select|insert|update|delete|drop|create|alter)\b)/gi,
      /(\b(and|or)\s+\d+\s*=\s*\d+)/gi,
      /(\b(and|or)\s+['"]\w+['"]\s*=\s*['"]\w+['"])/gi,
      /(--|\/\*|\*\/)/g,
      /(\b(xp_|sp_|fn_)\w+)/gi
    ];

    return !sqlPatterns.some(pattern => pattern.test(input));
  }

  // Rate limiting
  checkRateLimit(identifier: string, limit: number = 100, windowMs: number = 60000): boolean {
    const now = Date.now();
    const key = identifier;
    const current = this.rateLimitMap.get(key);

    if (!current) {
      this.rateLimitMap.set(key, {
        count: 1,
        resetTime: now + windowMs
      });
      return true;
    }

    if (now > current.resetTime) {
      this.rateLimitMap.set(key, {
        count: 1,
        resetTime: now + windowMs
      });
      return true;
    }

    if (current.count >= limit) {
      this.logSecurityEvent('RATE_LIMIT_EXCEEDED', { identifier, limit, windowMs });
      return false;
    }

    current.count++;
    this.rateLimitMap.set(key, current);
    return true;
  }

  // CSRF Protection
  generateCSRFToken(): string {
    return crypto.randomUUID();
  }

  validateCSRFToken(token: string, storedToken: string): boolean {
    return token === storedToken;
  }

  // Password strength validation
  validatePasswordStrength(password: string): PasswordStrength {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const score = [
      password.length >= minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar
    ].filter(Boolean).length;

    if (score < 3) return 'weak';
    if (score < 5) return 'medium';
    return 'strong';
  }

  // Session management
  validateSession(sessionId: string): boolean {
    // In production, this would check against a database
    return Boolean(sessionId && sessionId.length > 0);
  }

  // Audit logging
  logSecurityEvent(eventType: SecurityEventType, details: any): void {
    const event: SecurityEvent = {
      timestamp: new Date().toISOString(),
      eventType,
      details,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
      ip: 'client-ip', // In production, get from request
      sessionId: 'session-id' // In production, get from session
    };

    this.securityEvents.push(event);
    
    // In production, send to security monitoring service
    if (process.env.NODE_ENV === 'production') {
      this.sendToSecurityService(event);
    }
  }

  // Security headers
  getSecurityHeaders(): Record<string, string> {
    return {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Content-Security-Policy': this.getCSPHeader(),
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Resource-Policy': 'same-origin'
    };
  }

  private getCSPHeader(): string {
    return [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://api.openai.com https://api.anthropic.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join('; ');
  }

  // Data encryption
  async encryptData(data: string, key: string): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      encoder.encode(key),
      { name: 'AES-GCM' },
      false,
      ['encrypt']
    );

    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      dataBuffer
    );

    const encryptedArray = new Uint8Array(encrypted);
    const combined = new Uint8Array(iv.length + encryptedArray.length);
    combined.set(iv);
    combined.set(encryptedArray, iv.length);

    return btoa(String.fromCharCode(...combined));
  }

  async decryptData(encryptedData: string, key: string): Promise<string> {
    const decoder = new TextDecoder();
    const combined = new Uint8Array(
      atob(encryptedData).split('').map(char => char.charCodeAt(0))
    );

    const iv = combined.slice(0, 12);
    const encrypted = combined.slice(12);

    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(key),
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      encrypted
    );

    return decoder.decode(decrypted);
  }

  // Security monitoring
  private sendToSecurityService(event: SecurityEvent): void {
    // In production, send to security monitoring service
    console.log('Security Event:', event);
  }

  // Get security events for monitoring
  getSecurityEvents(): SecurityEvent[] {
    return [...this.securityEvents];
  }

  // Clear old security events
  clearOldEvents(maxAge: number = 24 * 60 * 60 * 1000): void {
    const cutoff = Date.now() - maxAge;
    this.securityEvents = this.securityEvents.filter(
      event => new Date(event.timestamp).getTime() > cutoff
    );
  }
}

// Types
export interface SecurityEventExtended {
  timestamp: string;
  eventType: SecurityEventType;
  details: any;
  userAgent: string;
  ip: string;
  sessionId: string;
}

export type SecurityEventType = 
  | 'LOGIN_ATTEMPT'
  | 'LOGIN_SUCCESS'
  | 'LOGIN_FAILURE'
  | 'RATE_LIMIT_EXCEEDED'
  | 'XSS_ATTEMPT'
  | 'SQL_INJECTION_ATTEMPT'
  | 'CSRF_ATTEMPT'
  | 'UNAUTHORIZED_ACCESS'
  | 'SUSPICIOUS_ACTIVITY';

export interface RateLimitInfo {
  count: number;
  resetTime: number;
}

export type PasswordStrength = 'weak' | 'medium' | 'strong';

// Security middleware for Next.js
export function withSecurity(handler: any) {
  return async (req: any, res: any) => {
    const security = SecurityManager.getInstance();
    
    // Add security headers
    Object.entries(security.getSecurityHeaders()).forEach(([key, value]) => {
      res.setHeader(key, value);
    });

    // Rate limiting
    const clientId = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (!security.checkRateLimit(clientId)) {
      return res.status(429).json({ error: 'Rate limit exceeded' });
    }

    // Input validation
    if (req.body) {
      const sanitizedBody = Object.keys(req.body).reduce((acc, key) => {
        acc[key] = typeof req.body[key] === 'string' 
          ? security.sanitizeInput(req.body[key])
          : req.body[key];
        return acc;
      }, {} as any);
      req.body = sanitizedBody;
    }

    return handler(req, res);
  };
}
