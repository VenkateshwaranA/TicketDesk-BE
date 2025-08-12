import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TicketsService {
  constructor(private readonly http: HttpService) {}

  async list(ownerId?: string) {
    const url = new URL(`http://localhost:${process.env.TICKETS_PORT ?? 3013}/tickets`);
    if (ownerId) url.searchParams.set('ownerId', ownerId);
    const res = await firstValueFrom(this.http.get(url.toString()));
    return res.data;
  }

  async create(body: any) {
    try {
      console.log('body', body);
      const url = `http://localhost:${process.env.TICKETS_PORT ?? 3013}/tickets`;
      const res = await firstValueFrom(this.http.post(url, body));
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async update(id: string, body: any) {
    const url = `http://localhost:${process.env.TICKETS_PORT ?? 3013}/tickets/${id}`;
    const res = await firstValueFrom(this.http.patch(url, body));
    return res.data;
  }

  async assign(id: string, userId: string) {
    const url = `http://localhost:${process.env.TICKETS_PORT ?? 3013}/tickets/${id}/assign/${userId}`;
    const res = await firstValueFrom(this.http.patch(url, {}));
    return res.data;
  }

  async unassign(id: string) {
    const url = `http://localhost:${process.env.TICKETS_PORT ?? 3013}/tickets/${id}/unassign`;
    const res = await firstValueFrom(this.http.patch(url, {}));
    return res.data;
  }

  async remove(id: string) {
    const url = `http://localhost:${process.env.TICKETS_PORT ?? 3013}/tickets/${id}`;
    const res = await firstValueFrom(this.http.delete(url));
    return res.data;
  }
}


