import { INestApplication } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import request from 'supertest';
import { App } from 'supertest/types';
import { buildApp } from '../helpers/app.helper';
import { clearPetsTable } from '../helpers/db.helper';

describe('Pets Cache (e2e)', () => {
  let app: INestApplication<App>;
  let cache: Cache;

  const validPet = { name: 'Firulais', birthDate: '2020-03-15', breed: 'Labrador' };

  beforeAll(async () => {
    app = await buildApp();
    cache = app.get<Cache>(CACHE_MANAGER);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await clearPetsTable(app);
    await cache.clear();
  });

  // ─── Población de cache ───────────────────────────────────────────────────────

  describe('Población de cache en GETs', () => {
    it('GET /pets almacena la key en cache', async () => {
      expect(await cache.get('/pets')).toBeUndefined();

      await request(app.getHttpServer()).get('/pets').expect(200);

      expect(await cache.get('/pets')).toBeDefined();
    });

    it('GET /pets/:id almacena la key específica en cache', async () => {
      const created = await request(app.getHttpServer()).post('/pets').send(validPet);
      const id = created.body.data.id as string;

      expect(await cache.get(`/pets/${id}`)).toBeUndefined();

      await request(app.getHttpServer()).get(`/pets/${id}`).expect(200);

      expect(await cache.get(`/pets/${id}`)).toBeDefined();
    });
  });

  // ─── Invalidación por POST ────────────────────────────────────────────────────

  describe('POST /pets invalida cache', () => {
    it('invalida /pets después de crear un pet', async () => {
      await request(app.getHttpServer()).get('/pets');
      expect(await cache.get('/pets')).toBeDefined();

      await request(app.getHttpServer()).post('/pets').send(validPet).expect(201);

      expect(await cache.get('/pets')).toBeUndefined();
    });

    it('GET /pets después del POST refleja el nuevo pet', async () => {
      await request(app.getHttpServer()).get('/pets');

      await request(app.getHttpServer()).post('/pets').send(validPet);

      const res = await request(app.getHttpServer()).get('/pets').expect(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].name).toBe(validPet.name);
    });

    it('no invalida keys de pets individuales al crear', async () => {
      const created = await request(app.getHttpServer()).post('/pets').send(validPet);
      const id = created.body.data.id as string;
      await request(app.getHttpServer()).get(`/pets/${id}`);
      expect(await cache.get(`/pets/${id}`)).toBeDefined();

      await request(app.getHttpServer())
        .post('/pets')
        .send({ name: 'Luna', birthDate: '2022-07-01', breed: 'Poodle' });

      expect(await cache.get(`/pets/${id}`)).toBeDefined();
    });
  });

  // ─── Invalidación por PUT ─────────────────────────────────────────────────────

  describe('PUT /pets/:id invalida cache', () => {
    it('invalida /pets y /pets/:id después de actualizar', async () => {
      const created = await request(app.getHttpServer()).post('/pets').send(validPet);
      const id = created.body.data.id as string;

      await request(app.getHttpServer()).get('/pets');
      await request(app.getHttpServer()).get(`/pets/${id}`);
      expect(await cache.get('/pets')).toBeDefined();
      expect(await cache.get(`/pets/${id}`)).toBeDefined();

      await request(app.getHttpServer()).put(`/pets/${id}`).send({ name: 'Updated' }).expect(200);

      expect(await cache.get('/pets')).toBeUndefined();
      expect(await cache.get(`/pets/${id}`)).toBeUndefined();
    });

    it('GET /pets/:id después del PUT refleja los cambios', async () => {
      const created = await request(app.getHttpServer()).post('/pets').send(validPet);
      const id = created.body.data.id as string;
      await request(app.getHttpServer()).get(`/pets/${id}`);

      await request(app.getHttpServer()).put(`/pets/${id}`).send({ breed: 'Labrador Mix' });

      const res = await request(app.getHttpServer()).get(`/pets/${id}`).expect(200);
      expect(res.body.data.breed).toBe('Labrador Mix');
    });
  });

  // ─── Invalidación por DELETE ──────────────────────────────────────────────────

  describe('DELETE /pets/:id invalida cache', () => {
    it('invalida /pets y /pets/:id después de eliminar', async () => {
      const created = await request(app.getHttpServer()).post('/pets').send(validPet);
      const id = created.body.data.id as string;

      await request(app.getHttpServer()).get('/pets');
      await request(app.getHttpServer()).get(`/pets/${id}`);
      expect(await cache.get('/pets')).toBeDefined();
      expect(await cache.get(`/pets/${id}`)).toBeDefined();

      await request(app.getHttpServer()).delete(`/pets/${id}`).expect(204);

      expect(await cache.get('/pets')).toBeUndefined();
      expect(await cache.get(`/pets/${id}`)).toBeUndefined();
    });

    it('GET /pets después del DELETE no incluye el pet eliminado', async () => {
      const created = await request(app.getHttpServer()).post('/pets').send(validPet);
      const id = created.body.data.id as string;
      await request(app.getHttpServer()).get('/pets');

      await request(app.getHttpServer()).delete(`/pets/${id}`);

      const res = await request(app.getHttpServer()).get('/pets').expect(200);
      expect(res.body.data).toHaveLength(0);
    });
  });
});
