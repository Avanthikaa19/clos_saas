import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { fadeInOutRouter } from 'src/app/app.animations';
// import { app_header_height } from 'src/app/app.constants';

@Component({
  selector: 'app-developer-tools',
  templateUrl: './developer-tools.component.html',
  styleUrls: ['./developer-tools.component.scss'],
  animations: [fadeInOutRouter]
})
export class DeveloperToolsComponent implements OnInit, OnDestroy {
  title: string = '';
  component_height;
  @HostListener('window:resize', ['$event'])
  updateComponentSize(event?) {
    this.component_height = window.innerHeight - 10;
  }

  routeEventSub: Subscription;

  constructor(
    private router: ActivatedRoute,
    private route: Router
  ) {
    this.updateComponentSize();
    this.routeEventSub = route.events.subscribe(() => {
      this.title = this.routeToTitle(this.router.snapshot.firstChild.url.join(''));
    });
  }

  routeToTitle(input: string): string {
    switch(input) {
      case 'reports': {
        return 'Reports';
      }
      case 'extraction-queries': {
        return 'Extraction Queries'
      }
      case 'computation-queries': {
        return 'Computation Queries'
      }
      case 'layouts': {
        return 'Layouts';
      }
      case 'themes': {
        return 'Themes';
      }
      case 'package': {
        return 'Import & Export Wizard';
      }
    }
    return '';
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.routeEventSub.unsubscribe();
  }

  goBack() {
    this.route.navigate(['/reports/home']);
  }

}
