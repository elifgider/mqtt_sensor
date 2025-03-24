const mqtt = require("mqtt");
require("dotenv").config();

const BROKER = process.env.BROKER || 'mqtt://mqtt-broker';  // MQTT Broker URL
const TOPIC = process.env.TOPIC || 'office/sensor';  // MQTT Konusu

// MQTT broker bağlantısı
const client = mqtt.connect(BROKER);

client.on("connect", () => {
  console.log(`MQTT Broker'a bağlandı: ${BROKER}`);

  setInterval(() => {
    const data = {
      sensor_id: "sensor123",
      temperature: (20 + Math.random() * 5).toFixed(2),  // 20-25 derece arasında rastgele
      humidity: (50 + Math.random() * 10).toFixed(2),    // %50-60 arası rastgele
    };

    const message = JSON.stringify(data);
    client.publish(TOPIC, message, () => {
      console.log(`Veri gönderildi: ${message}`);
    });

  }, 50000); // Her 5 saniyede bir veri gönderir
});

client.on("error", (error) => {
  console.error(`MQTT bağlantı hatası:`, error);
});