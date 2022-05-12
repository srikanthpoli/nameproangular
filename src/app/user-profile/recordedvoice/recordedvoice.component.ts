import {Component, Input, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {HttpClient} from '@angular/common/http';
import * as RecordRTC from 'recordrtc'
import {GlobalConstants} from '../../common/global-constants';

@Component({
    selector: 'app-recorded',
    templateUrl: './recordedvoice.component.html',
    styleUrls: ['./recordedvoice.component.scss']
})
export class RecordedvoiceComponent implements OnInit {
    title = 'micRecorder';
    fileUploadInProgress = false;
    fileFound = false;
    @Input('employeeId') employeeID:any;
    

    // Lets declare Record OBJ
    record: any;
    // Will use this flag for toggeling recording
    recording = false;
    // URL of Blob
    url: any;
    urlRecorded: any;
    approvalDto: any;
    error: any;
    voiceLoader = false;
    isRecordedVoicePresent = false;
    loader = false;
    recordedData: any;
    isAdmin:any;


    ngOnInit() {
      this.isAdmin=JSON.parse(localStorage.getItem('userData')).roles.includes('ADMIN')?true:false;
        this.fileFound = false;
        this.loader = true;
        this.http.get(GlobalConstants.URL + 'employee/sound/' + this.employeeID)
            .subscribe((data: any) => {
                console.log('data here' + JSON.stringify(data));
                if (data) {
                    this.recordedData = data;
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
        this.recordedData.status = "Pending";

    }

    send(audioFile: File) {
        const formData: FormData = new FormData();
        formData.append('file', audioFile, 'Recorded-' + this.employeeID + '.wav');
        this.http.post(GlobalConstants.URL + 'employee/sound/' + this.employeeID
            , formData, {responseType: 'blob'}).subscribe(data => {
            this.loader = false;
            this.urlRecorded =
                GlobalConstants.URL + 'blob/getBlob?blobName=Recorded-' + this.employeeID + '.wav';

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
        audio.src = GlobalConstants.URL + 'blob/getBlob?blobName=Recorded-' + this.employeeID + '.wav';
        audio.load();
        audio.play();
        this.setTimeout()

    }

    setTimeout() {
        setTimeout(() => {
            this.loader = false
        }, 5000)
    }

    onDelete() {
        this.loader = true;
        this.http.delete(GlobalConstants.URL + 'employee/sound/' + this.employeeID, {
            responseType: 'blob'
        })
            .subscribe(data => {
                this.loader = false;
                this.fileFound = false;
            })


    }

    onApprove() {
        this.loader = true;

        this.http.post(GlobalConstants.URL + 'employee/sound/approve',
            {
                'employeeId': this.employeeID,
                'approvalEmployeeId': 1989197,
                'approved': 1,
                'reason': '',
            }, {responseType: 'blob'})
            .subscribe(data => {
                this.http.get(GlobalConstants.URL + 'employee/sound/' + this.employeeID)
                    .subscribe((localdata: any) => {
                        console.log('data here' + JSON.stringify(localdata));
                        if (localdata) {
                            this.recordedData = localdata
                        }
                        this.loader = false;
                        this.fileFound = true;
                    });

            });
    }



    onDecline() {
        this.loader = true;

        this.http.post(GlobalConstants.URL + 'employee/sound/approve',
            {
                'employeeId': this.employeeID,
                'approvalEmployeeId': 1989197,
                'approved': 0,
                'reason': 'declined',
            }, {responseType: 'blob'})
            .subscribe(data => {
                this.http.get(GlobalConstants.URL + 'employee/sound/' + this.employeeID)
                    .subscribe((localdata: any) => {
                        console.log('data here' + JSON.stringify(localdata));
                        if (localdata) {
                            this.recordedData = localdata
                        }
                        this.loader = false;
                        this.fileFound = true;
                    });

            });
    }
}
