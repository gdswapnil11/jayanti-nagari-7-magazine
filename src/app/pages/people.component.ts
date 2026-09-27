import { Component } from '@angular/core';
import { people } from '../data';

@Component({
  standalone: true,
  template: `
    <section class="page-header container"><span class="eyebrow">OUR COMMUNITY</span><h1>People</h1><p>The residents, volunteers, students and families who make this place feel like home.</p></section>
    <section class="container section people-page">
      @for (person of people; track person.name) {
        <article class="profile"><img [src]="person.image" [alt]="person.name"><div><span class="eyebrow">{{ person.role }}</span><h2>{{ person.name }}</h2><p>{{ person.story }}</p><button class="text-button">Read profile →</button></div></article>
      }
    </section>
  `
})
export class PeopleComponent { readonly people = people; }