import { Router } from '@angular/router';
import { AuthService } from './../service/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {TextToSpeechService} from '../service/text-to-speech-service';
import {MatSelectChange} from '@angular/material/select';
import {element} from 'protractor';
import { Subscription } from 'rxjs';

interface Language {
    value: string;
    viewValue: string;
};
interface Voice {
    value: string;
    viewValue: string;
    gender: string;
}



@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit//, OnDestroy
 {
    //private userSub:Subscription;
  isAuthenticated = false;
    languages: Language[] = [];
    voiceNames: Voice[] = [];
    dataLoaded = false;
    voiceLoader = false;
        voiceList: any[] = [];
    datalocal: any;
    shortName = '';
    languageName = '';
    genderName = '';
    notSelectedValidationFailed = true;


    constructor(private textToSpeechService: TextToSpeechService,private authService:AuthService,private router:Router) {
    }

    ngOnInit() {
       
        this.textToSpeechService.getVoiceList().subscribe(
            data => {
                 this.datalocal = data;
                this.languages = [];
                this.voiceList = [];
                console.log(data);
                // tslint:disable-next-line:no-shadowed-variable
                this.datalocal.forEach((element) => {
                    if (element.LocaleName.indexOf('India') > -1 || element.LocaleName.indexOf('English') >  -1) {
                        if (!(this.voiceList.includes(element.Locale + ':' + element.LocaleName))) {
                            this.voiceList.push(element.Locale + ':' + element.LocaleName)
                        }
                    }
                });

                // tslint:disable-next-line:no-shadowed-variable
                this.voiceList.forEach((element) => {
                    this.languages.push({value : element.substring(0, element.indexOf(':', 0))  ,
                        viewValue:     element.substring(element.indexOf(':', 0) + 1)    });
                });
                this.dataLoaded = true;
                console.log(this.languages);




            }
        )

    }

    onChange($event: MatSelectChange) {
        this.shortName = ''
        this.runValidation();
        this.languageName = $event.value;
        console.log($event.value);
        this.voiceNames = [];
        this.datalocal.forEach(data => {
            if (data.Locale === $event.value) {
                this.voiceNames.push({
                    value: data.ShortName + ':' + data.Gender,
                    viewValue: data.DisplayName + ' (' + data.VoiceType + ')',
                    gender: data.Gender
                });
            };
        });
    }


    onPlayStandard() {
        this.voiceLoader = true;
        const audio = new Audio();

        audio.src = 'https://nameprobyorion.azurewebsites.net/texttospeech/download?employeeName=' +
            'Srikanth Polisetty&gender=' + this.genderName + '&lang=' + this.languageName + '&voiceName=' + this.shortName;
        audio.load();
        audio.play();
       this.setTimeout();

    }

    setTimeout() {
        setTimeout(() => { this.voiceLoader = false }, 7000)
    }

    onChangeofVoice(data: MatSelectChange) {
        this.shortName = ''
        this.runValidation();
        this.genderName = data.value.substring(data.value.indexOf(':', 0) + 1);
        this.shortName = data.value.substring(0, data.value.indexOf(':', 0));
        console.log(' The values are ' + this.genderName + ' ' + this.shortName + ' ' + this.languageName);

        this.runValidation();

    }
     runValidation() {
        if (this.shortName !== '' && this.languageName !== '') {
            this.notSelectedValidationFailed = false;
        } else {
            this.notSelectedValidationFailed = true
        }
    }
    
}
