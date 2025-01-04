import { Component, OnInit , inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserService } from '../core/services/user.service';
import { User } from '../core/models/user.interface';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule, MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule
     ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  
  public userService = inject(UserService);
  subscriptions = new Subscription();
  users: User[] = [];
  user: User = { id: 0, first_name: '', last_name: '', email: '' };
  displayedColumns: string[] = ['first_name', 'last_name', 'email', 'actions'];

  ngOnInit(): void {
    this.listUsers();
    this.loadUsers();
  }

  listUsers() {
    const subscription = this.userService.listUsers().subscribe((response) => {
      this.users = response.data;
      localStorage.setItem('users', JSON.stringify(this.users));
    });
    this.subscriptions.add(subscription);
  }

  loadUsers() {
    this.users = this.userService.getUsers();
  } 

  onSubmit() {
    if (this.user.id) {
      this.userService.updateUser(this.user);
    } else {
      this.userService.createUser(this.user);
    }
    this.user = { id: 0, first_name: '', last_name: '', email: '' };
    this.loadUsers();
  }

  editUser(user: User) {
    this.user = { ...user };
  }

  deleteUser(userId: number) {
    this.userService.deleteUser(userId);
    this.loadUsers();
  } 

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
