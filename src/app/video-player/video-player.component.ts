import { Component, OnInit } from '@angular/core';
import Hls from 'hls.js';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent implements OnInit {
  videoElement!: HTMLVideoElement;
  link: string | null;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.link = this.route.snapshot.paramMap.get('link');
    this.videoElement = document.getElementById('videoPlayer') as HTMLVideoElement;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(this.link!);
      hls.attachMedia(this.videoElement);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        this.videoElement.play();
      });
    } else if (this.videoElement.canPlayType('application/vnd.apple.mpegurl')) {
      this.videoElement.src = this.link!;
      this.videoElement.addEventListener('loadedmetadata', () => {
        this.videoElement.play();
      });
    } else {
      console.error('HLS.js is not supported in this browser.');
    }
  }
}
