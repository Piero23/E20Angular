import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {SearchBar} from '../search-bar/search-bar';
import {NgOptimizedImage} from '@angular/common';
import {Avatar} from '../avatar/avatar';


@Component({
  selector: 'app-top-bar',
  imports: [
    RouterLink,
    SearchBar,
    Avatar,
    NgOptimizedImage,
  ],
  templateUrl: './top-bar.html',
  styleUrl: './top-bar.css'
})
export class TopBar { }
