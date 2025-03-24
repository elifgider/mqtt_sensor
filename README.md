# Sensor Monitoring System

Bu proje, IoT sensörlerinden gelen verilerin izlenmesi ve yönetilmesi için geliştirilmiş bir web uygulamasıdır. Sistem, MQTT protokolü üzerinden sensör verilerini toplar, işler ve kullanıcılara görselleştirir.


### Sistem Bileşenleri

1. **Frontend (React + TypeScript)**
   - Kullanıcı arayüzü
   - Gerçek zamanlı veri görselleştirme
   - Rol tabanlı erişim kontrolü

2. **Backend (NestJS)**
   - REST API
   - Kullanıcı yönetimi
   - Veri işleme ve depolama

3. **MQTT Publisher**
   - Sensör verilerini simüle eden Docker container
   - Belirli aralıklarla MQTT broker'a veri gönderir
   - Farklı sensör tipleri için veri üretir

4. **MQTT Receiver**
   - MQTT broker'dan veri alan Docker container
   - Gelen verileri işler ve veritabanına kaydeder
   - Veri doğrulama ve filtreleme

5. **Veritabanı**
   - PostgreSQL: Kullanıcı ve şirket verileri
   - InfluxDB: Sensör verileri ve zaman serisi verileri

## 🚀 Teknolojiler

### Backend
- Node.js
- NestJS
- PostgreSQL
- TypeORM
- JWT Authentication
- MQTT.js
- InfluxDB

### Frontend
- React
- TypeScript
- Material-UI
- React Router
- Axios
- Chart.js (Veri görselleştirme)

### Docker
- Docker Compose
- Özel MQTT Publisher image
- Özel MQTT Receiver image
- Mosquitto MQTT Broker
- PostgreSQL
- InfluxDB

## 🛠 Kurulum

1. Projeyi klonlayın:
```bash
git clone git@github.com:elifgider/mqtt_sensor.git
cd mqtt-sensor-monitoring
```

2. Gerekli ortam değişkenlerini ayarlayın:
```bash
# Backend için (.env dosyası)
# Frontend için (.env dosyası)
REACT_APP_API_URL=http://localhost:3001
```

3. Docker ile projeyi başlatın:
```bash
docker-compose up --build
```

4. Tarayıcıda uygulamayı açın:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## 🔄 Veri Akışı

1. **Veri Üretimi**
   - MQTT Publisher container'ı belirli aralıklarla sensör verileri üretir
   - Veriler MQTT broker'a gönderilir

2. **Veri Alımı**
   - MQTT Receiver container'ı broker'dan verileri alır
   - Veriler doğrulanır ve işlenir
   - Zaman serisi verileri InfluxDB'ye kaydedilir

3. **Veri Görüntüleme**
   - Frontend, backend API üzerinden verileri çeker
   - Kullanıcı rolüne göre veriler filtrelenir
   - Veriler grafikler ve tablolar halinde görüntülenir


## 🔒 Güvenlik

- Tüm API endpointleri JWT token doğrulaması gerektirir
- Şifreler bcrypt ile hashlenir
- Role-based access control (RBAC) uygulanmıştır
- MQTT bağlantıları TLS ile şifrelenir
- Docker container'ları izole edilmiş ağlarda çalışır
