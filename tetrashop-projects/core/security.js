
// 📁 core/security.js
class SecurityGuardian {
  constructor() {
    this.encryption = new EncryptionEngine();
    this.auth = new Authentication();
    this.monitor = new SecurityMonitor();
  }

  encryptData(data, key) {
    return this.encryption.aesEncrypt(data, key);
  }

  authenticateUser(credentials) {
    return this.auth.multiFactorAuth(credentials);
  }

  monitorSystem() {
    setInterval(() => {
      this.checkSuspiciousActivities();
      this.scanForThreats();
      this.updateFirewall();
    }, 5000);
  }
}
