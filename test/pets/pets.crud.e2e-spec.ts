import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { buildApp } from '../helpers/app.helper';
import { clearPetsTable } from '../helpers/db.helper';

describe('Pets CRUD (e2e)', () => {
  let app: INestApplication<App>;

  const validPet = { name: 'Firulais', birthDate: '2020-03-15', breed: 'Labrador' };

  beforeAll(async () => {
    app = await buildApp();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await clearPetsTable(app);
  });

  // ─── POST /pets ──────────────────────────────────────────────────────────────

  describe('POST /pets', () => {
    it('201 — crea un pet con datos válidos', async () => {
      const res = await request(app.getHttpServer()).post('/pets').send(validPet).expect(201);

      expect(res.body.data).toMatchObject({
        name: validPet.name,
        breed: validPet.breed,
      });
      expect(res.body.data.id).toBeDefined();
      expect(res.body.data.createdAt).toBeDefined();
    });

    it('400 — falla sin nombre', async () => {
      await request(app.getHttpServer())
        .post('/pets')
        .send({ birthDate: '2020-01-01', breed: 'Labrador' })
        .expect(400);
    });

    it('400 — falla con fecha de nacimiento inválida', async () => {
      await request(app.getHttpServer())
        .post('/pets')
        .send({ name: 'Rex', birthDate: 'not-a-date', breed: 'Poodle' })
        .expect(400);
    });

    it('400 — falla con fecha de nacimiento en el futuro', async () => {
      await request(app.getHttpServer())
        .post('/pets')
        .send({ name: 'Rex', birthDate: '2099-01-01', breed: 'Poodle' })
        .expect(400);
    });
  });

  // ─── GET /pets ───────────────────────────────────────────────────────────────

  describe('GET /pets', () => {
    it('200 — retorna lista vacía cuando no hay pets', async () => {
      const res = await request(app.getHttpServer()).get('/pets').expect(200);

      expect(res.body.data).toEqual([]);
    });

    it('200 — retorna todos los pets creados', async () => {
      await request(app.getHttpServer()).post('/pets').send(validPet);
      await request(app.getHttpServer())
        .post('/pets')
        .send({ name: 'Luna', birthDate: '2022-07-01', breed: 'Golden Retriever' });

      const res = await request(app.getHttpServer()).get('/pets').expect(200);

      expect(res.body.data).toHaveLength(2);
    });
  });

  // ─── GET /pets/:id ───────────────────────────────────────────────────────────

  describe('GET /pets/:id', () => {
    it('200 — retorna el pet correcto por ID', async () => {
      const created = await request(app.getHttpServer()).post('/pets').send(validPet);
      const id = created.body.data.id as string;

      const res = await request(app.getHttpServer()).get(`/pets/${id}`).expect(200);

      expect(res.body.data.id).toBe(id);
      expect(res.body.data.name).toBe(validPet.name);
    });

    it('404 — retorna error si el ID no existe', async () => {
      const res = await request(app.getHttpServer())
        .get('/pets/00000000-0000-0000-0000-000000000000')
        .expect(404);

      expect(res.body.error.type).toBe('NOT_FOUND');
    });
  });

  // ─── PUT /pets/:id ───────────────────────────────────────────────────────────

  describe('PUT /pets/:id', () => {
    it('200 — actualiza solo el nombre', async () => {
      const created = await request(app.getHttpServer()).post('/pets').send(validPet);
      const id = created.body.data.id as string;

      const res = await request(app.getHttpServer())
        .put(`/pets/${id}`)
        .send({ name: 'Firulais Updated' })
        .expect(200);

      expect(res.body.data.name).toBe('Firulais Updated');
      expect(res.body.data.breed).toBe(validPet.breed);
    });

    it('200 — updatedAt cambia después de la actualización', async () => {
      const created = await request(app.getHttpServer()).post('/pets').send(validPet);
      const { id, updatedAt: originalUpdatedAt } = created.body.data as {
        id: string;
        updatedAt: string;
      };

      await new Promise((r) => setTimeout(r, 50));

      const res = await request(app.getHttpServer())
        .put(`/pets/${id}`)
        .send({ breed: 'Labrador Mix' })
        .expect(200);

      expect(new Date(res.body.data.updatedAt).getTime()).toBeGreaterThan(
        new Date(originalUpdatedAt).getTime(),
      );
    });

    it('404 — retorna error si el ID no existe', async () => {
      const res = await request(app.getHttpServer())
        .put('/pets/00000000-0000-0000-0000-000000000000')
        .send({ name: 'Ghost' })
        .expect(404);

      expect(res.body.error.type).toBe('NOT_FOUND');
    });
  });

  // ─── DELETE /pets/:id ────────────────────────────────────────────────────────

  describe('DELETE /pets/:id', () => {
    it('204 — elimina el pet correctamente', async () => {
      const created = await request(app.getHttpServer()).post('/pets').send(validPet);
      const id = created.body.data.id as string;

      await request(app.getHttpServer()).delete(`/pets/${id}`).expect(204);

      await request(app.getHttpServer()).get(`/pets/${id}`).expect(404);
    });

    it('404 — retorna error si el ID no existe', async () => {
      const res = await request(app.getHttpServer())
        .delete('/pets/00000000-0000-0000-0000-000000000000')
        .expect(404);

      expect(res.body.error.type).toBe('NOT_FOUND');
    });
  });
});
