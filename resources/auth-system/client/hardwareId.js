// client/hardwareId.js

function getHardwareId() {
    // Логіка отримання унікального ідентифікатора апаратного забезпечення
    // Наприклад, використовуючи alt.getUniqueId()
    const hardwareId = alt.getUniqueId();
    return hardwareId;
  }
  
  export { getHardwareId };