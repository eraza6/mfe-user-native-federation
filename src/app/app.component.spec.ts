import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { UserService } from '../core/services/user.service';
import { User } from '../core/models/user.interface';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';

describe('AppComponent', () => {

  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let service: UserService;

  const mockUsers: User[] = [
    { id: 1, first_name: 'Jose', last_name: 'Rodri', email: 'jrodri@hotmail.com' },
    { id: 2, first_name: 'Juan', last_name: 'Mendoza', email: 'jmendozar@hotmail.com' },
  ];

  beforeEach(async () => {

    const userServiceMock = jasmine.createSpyObj('UserService', ['listUsers', 'getUsers', 'createUser', 'updateUser', 'deleteUser']);

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [{ useValue: userServiceMock }, provideHttpClient(), provideHttpClientTesting(),]
    }).compileComponents();

    service = TestBed.inject(UserService);
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  describe('listUsers', () => {
    it('should list users from the API and localstorage', () => {
      const httpSpy = spyOn(service, 'listUsers').and.returnValue(of({ data: mockUsers }));
      component.listUsers();

      expect(httpSpy).toHaveBeenCalled();
      expect(localStorage.getItem('users')).toBe(JSON.stringify(mockUsers));
    });
  });

  describe('loadUsers', () => {
    it('should load users from localStorage', () => {
      localStorage.setItem('users', JSON.stringify(mockUsers));
      const httpSpy = spyOn(service, 'getUsers').and.returnValue(mockUsers);

      component.loadUsers();

      expect(component.users.length).toBe(2);
      expect(component.users[0].first_name).toBe('Jose');
    });
  });

  describe('onSubmit', () => {
    it('should create a new user if user.id is 0', () => {
      const newUser: User = { id: 0, first_name: 'Eli', last_name: 'Carvajal', email: 'ecarvajal@hotmail.com' };
      const httpSpy = spyOn(service, 'createUser');
      component.user = newUser;
      httpSpy.and.callFake(() => {
        const users = [...mockUsers, { ...newUser, id: 2 }];
        localStorage.setItem('users', JSON.stringify(users));
      });

      component.onSubmit();

      expect(httpSpy).toHaveBeenCalledWith(newUser);
      expect(localStorage.getItem('users')).toContain('Eli');
    });
  });

  describe('editUser', () => {
    it('should set the user property with the selected user', () => {
      const selectedUser = mockUsers[0];

      component.editUser(selectedUser);

      expect(component.user).toEqual(selectedUser);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user by ID', () => {
      const httpSpy = spyOn(service, 'deleteUser');
      httpSpy.and.callFake(() => {
        const users = mockUsers.filter((u) => u.id !== 1);
        localStorage.setItem('users', JSON.stringify(users));
      });

      component.deleteUser(1);

      expect(httpSpy).toHaveBeenCalledWith(1);
      expect(localStorage.getItem('users')).not.toContain('Jose');
    });
  });

});
