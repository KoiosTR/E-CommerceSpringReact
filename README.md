
<p align="center">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=java,spring,maven,react,vite,tailwind,postgres" />
  </a>
</p>

# E-Commerce Projesi

Bu proje, modern bir e-ticaret platformu sunmak için Spring Boot ve React kullanılarak geliştirilmiş full-stack bir web uygulamasıdır.

## Özellikler

- 🛍️ **Kullanıcı Özellikleri**
  - Kullanıcı kaydı ve girişi
  - Ürün listeleme ve detay görüntüleme
  - Alışveriş sepeti yönetimi
  - Sipariş oluşturma ve takip

- 👨‍💼 **Admin Paneli**
  - Ürün yönetimi (ekleme, silme, güncelleme)
  - Ürün resmi yükleme
  - Stok takibi
  - Kullanıcı yönetimi

- 🔒 **Güvenlik**
  - JWT tabanlı kimlik doğrulama
  - Role dayalı yetkilendirme
  - Güvenli parola yönetimi

## Teknolojiler

### Backend
- Java 17
- Spring Boot 3.x
- Spring Security
- Spring Data JPA
- PostgreSQL
- Lombok
- JWT

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- Axios

## Kurulum

### Gereksinimler
- Java 17 veya üzeri
- Node.js 18 veya üzeri
- PostgreSQL 15 veya üzeri
- Maven

### Backend Kurulumu

1. Projeyi klonlayın:
```bash
git clone https://github.com/KoiosTR/E-CommerceSpringReact
cd e-commerce
```

2. PostgreSQL veritabanı oluşturun:
```sql
CREATE DATABASE ecommerce;
```

3. `src/main/resources/application.properties` dosyasını düzenleyin:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/ecommerce
spring.datasource.username=your_username
spring.datasource.password=your_password
```

4. Projeyi derleyin ve çalıştırın:
```bash
mvn clean install
mvn spring-boot:run
```

Backend http://localhost:8080 adresinde çalışacaktır.

### Frontend Kurulumu

1. Frontend dizinine gidin:
```bash
cd src/main/front-end
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

Frontend http://localhost:5173 adresinde çalışacaktır.

## API Dokümantasyonu

API dokümantasyonuna http://localhost:8080/swagger-ui/index.html adresinden erişebilirsiniz.
