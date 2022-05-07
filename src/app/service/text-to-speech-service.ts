import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class TextToSpeechService {
    constructor(private http: HttpClient) {}

    getVoiceList() {
       return  this.http.get('http://nameprobyorion.azurewebsites.net/texttospeech/voicelist');
    }
}
