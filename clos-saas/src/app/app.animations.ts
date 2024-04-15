import {animate, animateChild, group, query, style, transition, trigger} from "@angular/animations";


//FADE IN OUT
export const fadeInOut = trigger('fadeInOut', [
  transition(':enter', [   // :enter is alias to 'void => *'
      style({ opacity: 0 }),
      animate(100, style({ opacity: 1 }))
  ]),
  transition(':leave', [   // :leave is alias to '* => void'
      animate(100, style({ opacity: 0 }))
  ])
]);
export const fadeInOut250 = trigger('fadeInOut250', [
  transition(':enter', [   // :enter is alias to 'void => *'
      style({ opacity: 0 }),
      animate(250, style({ opacity: 1 }))
  ]),
  transition(':leave', [   // :leave is alias to '* => void'
      animate(250, style({ opacity: 0 }))
  ])
]);

export const fadeInOutRouter = trigger('fadeInOutRouter', [
  // The '* => *' will trigger the animation to change between any two states
  transition('* => *', [
      // The query function has three params.
      // First is the event, so this will apply on entering or when the element is added to the DOM.
      // Second is a list of styles or animations to apply.
      // Third we add a config object with optional set to true, this is to signal
      // angular that the animation may not apply as it may or may not be in the DOM.
      query(':enter', [style({ opacity: 0 })], { optional: true }),
      query(
          ':leave',
          // here we apply a style and use the animate function to apply the style over 0.3 seconds
          [style({ opacity: 1 }), animate('0.1s', style({ opacity: 0 }))],
          { optional: true }
      ),
      query(
          ':enter',
          [style({ opacity: 0 }), animate('0.1s', style({ opacity: 1 }))],
          { optional: true }
      )
  ])
]);

export const slideInAnimation =
  trigger('routeAnimations', [
    transition('Home <=> FlowManager', [
      style({ position: 'relative' }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%'
        })
      ]),
      query(':enter', [
        style({ left: '-100%' })
      ]),
      query(':leave', animateChild()),
      group([
        query(':leave', [
          animate('300ms ease-out', style({ left: '100%' }))
        ]),
        query(':enter', [
          animate('300ms ease-out', style({ left: '0%' }))
        ])
      ]),
      query(':enter', animateChild()),
    ])
    // ,
    // transition('* <=> FilterPage', [
    //   style({ position: 'relative' }),
    //   query(':enter, :leave', [
    //     style({
    //       position: 'absolute',
    //       top: 0,
    //       left: 0,
    //       width: '100%'
    //     })
    //   ]),
    //   query(':enter', [
    //     style({ left: '-100%' })
    //   ]),
    //   query(':leave', animateChild()),
    //   group([
    //     query(':leave', [
    //       animate('200ms ease-out', style({ left: '100%' }))
    //     ]),
    //     query(':enter', [
    //       animate('300ms ease-out', style({ left: '0%' }))
    //     ])
    //   ]),
    //   query(':enter', animateChild()),
    // ])
  ]);
