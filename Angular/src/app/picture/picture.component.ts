import { Component, OnInit, Input, ElementRef, AfterViewInit, ViewChild } from '@angular/core'; // Input, ElementRef, AfterViewInit, ViewChild added
import { UserService } from '../shared/user.service';
import { Router } from "@angular/router";

import { pairwise, takeUntil, switchMap, tap, catchError } from 'rxjs/operators'
import { fromEvent } from 'rxjs';
import { PictureService } from '../shared/picture.service';
//import { map } from 'rxjs/operators';

@Component({
  selector: 'app-picture',
  templateUrl: './picture.component.html',
  styleUrls: ['./picture.component.css']
})
export class PictureComponent implements OnInit, AfterViewInit {

  pictures = [1, 2, 3, 4, 5];

  constructor(private userService: UserService, private router: Router, private pictureService: PictureService) { 
    
  }
  
  @ViewChild('canvas') public canvas: ElementRef;

  @Input() public width = 400;
  @Input() public height = 400;

  private cx: CanvasRenderingContext2D;

  public ngAfterViewInit() {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.cx = canvasEl.getContext('2d');

    canvasEl.width = this.width;
    canvasEl.height = this.height;

    this.cx.lineWidth = 3;
    this.cx.lineCap = 'round';
    this.cx.strokeStyle = '#000';

    this.captureEvents(canvasEl);
  }
  
  private captureEvents(canvasEl: HTMLCanvasElement) {
    // this will capture all mousedown events from the canvas element
    fromEvent(canvasEl, 'mousedown')
      .pipe(
        switchMap((e) => {
          // after a mouse down, we'll record all mouse moves
          return fromEvent(canvasEl, 'mousemove')
            .pipe(
              // we'll stop (and unsubscribe) once the user releases the mouse
              // this will trigger a 'mouseup' event    
              takeUntil(fromEvent(canvasEl, 'mouseup')),
              // we'll also stop (and unsubscribe) once the mouse leaves the canvas (mouseleave event)
              takeUntil(fromEvent(canvasEl, 'mouseleave')),
              // pairwise lets us get the previous value to draw a line from
              // the previous point to the current point    
              pairwise()
            )
        })
      )
      .subscribe((res: [MouseEvent, MouseEvent]) => {
        const rect = canvasEl.getBoundingClientRect();
  
        // previous and current position with the offset
        const prevPos = {
          x: res[0].clientX - rect.left,
          y: res[0].clientY - rect.top
        };
  
        const currentPos = {
          x: res[1].clientX - rect.left,
          y: res[1].clientY - rect.top
        };
  
        // this method we'll implement soon to do the actual drawing
        this.drawOnCanvas(prevPos, currentPos);
      });
  }

  private drawOnCanvas(prevPos: { x: number, y: number }, currentPos: { x: number, y: number }) {
    if (!this.cx) { return; }

    this.cx.beginPath();

    if (prevPos) {
      this.cx.moveTo(prevPos.x, prevPos.y); // from
      this.cx.lineTo(currentPos.x, currentPos.y);
      this.cx.stroke();
    }
  }
  
  ngOnInit(): void {
    console.log(this.pictures[0]);
    this.loadPictures();
    setTimeout(() => {
      console.log(this.pictures[0]); 
    }, 10000);
  }

  loadPictures() {
    this.pictureService.getPictures().subscribe({
      next(response) { this.pictures = response; console.log(response); },
      error(err) { console.error('Error: ' + err); },
      complete() { console.log(this.pictures[0]); console.log('Completed'); }
    });
  }


  onLogout(){
    this.userService.deleteToken();
    this.router.navigate(['/login']);
  }
}
