import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Credit Simulator E2E Tests', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Authentication', () => {
    it('should login successfully with valid credentials', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ username: 'analista', password: 'Analista123!' })
        .expect(201)
        .expect((res) => {
          expect(res.body.accessToken).toBeDefined();
          expect(res.body.refreshToken).toBeDefined();
          expect(res.body.user.username).toBe('analista');
          accessToken = res.body.accessToken;
        });
    });

    it('should fail login with invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ username: 'analista', password: 'wrongpassword' })
        .expect(401);
    });

    it('should refresh token successfully', async () => {
      const loginRes = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ username: 'analista', password: 'Analista123!' });

      return request(app.getHttpServer())
        .post('/api/auth/refresh')
        .send({ refreshToken: loginRes.body.refreshToken })
        .expect(201)
        .expect((res) => {
          expect(res.body.accessToken).toBeDefined();
        });
    });
  });

  describe('Applications', () => {
    it('should reject application for client over 80 years old', async () => {
      const birthDate = new Date();
      birthDate.setFullYear(birthDate.getFullYear() - 81);

      return request(app.getHttpServer())
        .post('/api/applications')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          fullName: 'Juan Pérez',
          identification: '001-010181-0001A',
          email: 'juan@example.com',
          phone: '88888888',
          birthDate: birthDate.toISOString().split('T')[0],
          employmentType: 'ASALARIADO',
          workplace: 'Empresa ABC',
          employmentYears: 10,
          monthlyIncome: 15000,
          requestedAmount: 50000,
          installments: 12,
          annualInterestRate: 12,
          paymentFrequency: 'MENSUAL',
          installmentAmount: 4442.44,
        })
        .expect(400);
    });

    it('should accept application for client exactly 80 years old', async () => {
      const birthDate = new Date();
      birthDate.setFullYear(birthDate.getFullYear() - 80);

      return request(app.getHttpServer())
        .post('/api/applications')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          fullName: 'María López',
          identification: '001-010144-0001B',
          email: 'maria@example.com',
          phone: '77777777',
          birthDate: birthDate.toISOString().split('T')[0],
          employmentType: 'INDEPENDIENTE',
          workplace: 'Negocio Propio',
          employmentYears: 5,
          monthlyIncome: 20000,
          requestedAmount: 30000,
          installments: 24,
          annualInterestRate: 10,
          paymentFrequency: 'QUINCENAL',
          installmentAmount: 1385.33,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.status).toBe('PENDIENTE');
        });
    });

    it('should create application with zero interest rate', async () => {
      const birthDate = new Date();
      birthDate.setFullYear(birthDate.getFullYear() - 30);

      return request(app.getHttpServer())
        .post('/api/applications')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          fullName: 'Carlos Ruiz',
          identification: '001-010194-0001C',
          email: 'carlos@example.com',
          phone: '66666666',
          birthDate: birthDate.toISOString().split('T')[0],
          employmentType: 'ASALARIADO',
          workplace: 'Empresa XYZ',
          employmentYears: 8,
          monthlyIncome: 25000,
          requestedAmount: 60000,
          installments: 12,
          annualInterestRate: 0,
          paymentFrequency: 'MENSUAL',
          installmentAmount: 5000,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.installmentAmount).toBe(5000);
        });
    });
  });
});
