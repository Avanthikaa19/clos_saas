import { Component, OnInit } from '@angular/core';
import { Router ,NavigationEnd} from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  showVersion: boolean = false;

  constructor(private router: Router) {
    this.showVersion = this.router.url.startsWith('/login');

    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.showVersion = this.router.url.startsWith('/login');

    });
  }

  ngOnInit(): void {
    this.showVersion = this.router.url.startsWith('/login');
  }

}
