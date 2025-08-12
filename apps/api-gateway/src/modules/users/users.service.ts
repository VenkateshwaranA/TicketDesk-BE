import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UsersService {
  constructor(private readonly http: HttpService) {}

  async list() {
    const url = new URL(`http://localhost:${process.env.USERS_PORT ?? 3012}/users`);
    // if (q) url.searchParams.set('q', q);
    const res = await firstValueFrom(this.http.get(url.toString()));
    return res.data;
  }

  async create(body: any) {
    const url = `http://localhost:${process.env.USERS_PORT ?? 3012}/users`;
    const res = await firstValueFrom(this.http.post(url, body));
    return res.data;
  }

  async update(id: string, body: any) {
    const url = `http://localhost:${process.env.USERS_PORT ?? 3012}/users/${id}`;
    const res = await firstValueFrom(this.http.patch(url, body));
    return res.data;
  }

  async remove(id: string) {
    const url = `http://localhost:${process.env.USERS_PORT ?? 3012}/users/${id}`;
    const res = await firstValueFrom(this.http.delete(url));
    return res.data;
  }
}


