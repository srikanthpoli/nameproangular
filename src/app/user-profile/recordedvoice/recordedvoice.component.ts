import {Component, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {HttpClient} from '@angular/common/http';
import * as RecordRTC from 'recordrtc'

@Component({
  selector: 'app-recorded',
  templateUrl: './recordedvoice.component.html',
  styleUrls: ['./recordedvoice.component.scss']
})
export class RecordedvoiceComponent implements OnInit {
  title = 'micRecorder';
  fileUploadInProgress = false;
  fileFound = false;
  employeeID = 1989197;

  // Lets declare Record OBJ
  record: any;
  // Will use this flag for toggeling recording
  recording = false;
  // URL of Blob
  url: any;
  urlRecorded: any;
  error: any;
  voiceLoader = false;
  isRecordedVoicePresent = false;
  loader = false;



  ngOnInit() {
    this.fileFound = false;
    this.loader = true;
    this.http.get('https://nameprobyorion.azurewebsites.net/employee/sound/' + this.employeeID)
        .subscribe(data => {
          console.log('data here' + JSON.stringify(data));
          if (data) {
            this.fileFound = true;
          }
                  this.loader = false;
        });

  }

  constructor(private domSanitizer: DomSanitizer, private http: HttpClient) {
  }

  sanitize(url: string) {
    return this.domSanitizer.bypassSecurityTrustUrl(url);
  }

  /**
   * Start recording.
   */
  initiateRecording() {

    this.recording = true;
    const mediaConstraints = {
      video: false,
      audio: true
    };
    navigator.mediaDevices
        .getUserMedia(mediaConstraints)
        .then(this.successCallback.bind(this), this.errorCallback.bind(this));
  }

  /**
   * Will be called automatically.
   */
  successCallback(stream: any) {
    const options = {
      mimeType: 'audio/wav',
      numberOfAudioChannels: 1,
      sampleRate: 44100
    };
    // Start Actuall Recording
    const StereoAudioRecorder = RecordRTC.StereoAudioRecorder;
    this.record = new StereoAudioRecorder(stream, options);
    this.record.record();
  }

  /**
   * Stop recording.
   */
  stopRecording() {
    this.recording = false;
    this.loader = true;
    this.record.stop(this.processRecording.bind(this));
  }

  /**
   * processRecording Do what ever you want with blob
   * @param  {any} blob Blog
   */

  processRecording(blob: any) {
    this.url = URL.createObjectURL(blob);
    console.log('blob', blob);
    console.log('url', this.url);
    const formData = new FormData();


    formData.append('Recorded-' + this.employeeID + '.wav', blob);

    this.send(blob);

  }
  send (audioFile: File) {
    const formData: FormData = new FormData();
    formData.append('file', audioFile, 'Recorded-' + this.employeeID + '.wav');
    this.http.post(   'https://nameprobyorion.azurewebsites.net/employee/uploadSound/' + this.employeeID
        , formData, {responseType: 'blob'}).subscribe(data => {
          this.loader = false;
          this.urlRecorded =
              'https://nameprobyorion.azurewebsites.net' +
              '/blob/getBlob?blobName=Recorded-' + this.employeeID + '.wav';

          this.fileFound = true;

    });


  }


  /**
   * Process Error.
   */
  errorCallback(error: any) {
    this.error = 'Can not play audio in your browser';
  }


  onPlayStandard() {

    const audio = new Audio();
    this.loader = true;
    audio.src = 'https://nameprobyorion.azurewebsites.net/blob/getBlob?blobName=Recorded-1989197.wav';
    audio.load();
    audio.play();
    this.setTimeout();
  }
  setTimeout() {
    setTimeout(() => { this.loader = false }, 5000)
  }

  onDelete() {
    this.loader = true;
    this.http.delete('https://nameprobyorion.azurewebsites.net/employee/sound/' + this.employeeID,{
      responseType: 'blob'
    })
        .subscribe(data => {
          this.loader = false;
          this.fileFound  = false;
        })


  }
}
