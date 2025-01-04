import { Injectable } from '@angular/core';
import { User } from '../models/user.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private localStorageKey = 'users';
  private apieUrl = environment.API_USER;
  constructor( private http: HttpClient) {
    // Inicializa los datos con la API si no existen en LocalStorage
    if (!localStorage.getItem(this.localStorageKey)) {
      this.listUsers();
    }
  }

  listUsers(): Observable<any> {
    return this.http.get(
      `${this.apieUrl}/users`
    );
  } 

  // Obtiene todos los usuarios
  getUsers(): User[] {
    return JSON.parse(localStorage.getItem(this.localStorageKey) || '[]');
  }

  // Crea un nuevo usuario
  createUser(user: User): void {
    const users = this.getUsers();
    user.id = new Date().getTime();
    users.push(user);
    localStorage.setItem(this.localStorageKey, JSON.stringify(users));
  }

  // Actualiza un usuario existente
  updateUser(user: User): void {
    const users = this.getUsers().map((u) => (u.id === user.id ? user : u));
    localStorage.setItem(this.localStorageKey, JSON.stringify(users));
  }

  // Elimina un usuario
  deleteUser(userId: number): void {
    const users = this.getUsers().filter((u) => u.id !== userId);
    localStorage.setItem(this.localStorageKey, JSON.stringify(users));
  }
}
