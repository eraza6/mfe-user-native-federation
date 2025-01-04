import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { User } from '../models/user.interface';
import { provideHttpClient } from '@angular/common/http';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    localStorage.clear();
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('listUsers', () => {
    it('should fetch users from the API', () => {
      const mockResponse = { data: [{ id: 1, first_name: 'George', last_name: 'Bluth', email: 'george.bluth@reqres.in' }] };

      service.listUsers().subscribe((res) => {
        expect(res.data.length).toBe(1);
        expect(res.data[0].first_name).toBe('George');
      });

      const req = httpMock.expectOne('https://reqres.in/api/users');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('LocalStorage Operations', () => {
    it('should retrieve users from LocalStorage', () => {
      const mockUsers: User[] = [{ id: 1, first_name: 'John', last_name: 'Doe', email: 'john.doe@example.com' }];
      localStorage.setItem('users', JSON.stringify(mockUsers));

      const users = service.getUsers();
      expect(users.length).toBe(1);
      expect(users[0].first_name).toBe('John');
    });

    it('should create a new user', () => {
      const newUser: User = { id: 0, first_name: 'Jane', last_name: 'Doe', email: 'jane.doe@example.com' };

      service.createUser(newUser);
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      expect(users.length).toBe(1);
      expect(users[0].first_name).toBe('Jane');
    });

    it('should update an existing user', () => {
      const mockUsers: User[] = [{ id: 1, first_name: 'John', last_name: 'Doe', email: 'john.doe@example.com' }];
      localStorage.setItem('users', JSON.stringify(mockUsers));

      const updatedUser: User = { id: 1, first_name: 'John', last_name: 'Smith', email: 'john.smith@example.com' };
      service.updateUser(updatedUser);

      const users = JSON.parse(localStorage.getItem('users') || '[]');
      expect(users[0].last_name).toBe('Smith');
    });

    it('should delete a user by ID', () => {
      const mockUsers: User[] = [
        { id: 1, first_name: 'John', last_name: 'Doe', email: 'john.doe@example.com' },
        { id: 2, first_name: 'Jane', last_name: 'Doe', email: 'jane.doe@example.com' },
      ];
      localStorage.setItem('users', JSON.stringify(mockUsers));

      service.deleteUser(1);
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      expect(users.length).toBe(1);
      expect(users[0].id).toBe(2);
    });
  });
});
