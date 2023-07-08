import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'efi-and-effie';
  selectedLanguage: string;
  isRTL: boolean;
  invitationText: any;
  formText: any;
  name: string = '';
  guests: number = 1;
  response: string;
  responseOptions: any;
  fontFamily: string;
  buttonDisabled: boolean;
  votingExpired: boolean = true;
  thankYouText: string;
  eventPassed: boolean = true;
  thankYouImgSrc: string;

  constructor(private http: HttpClient) {
    this.selectedLanguage = 'he-IL';
    this.fontFamily = 'Amatic SC'
    this.isRTL = true;
    this.invitationText = {
      names: 'אפי ואפרת',
      title: 'מתחתנים',
      date: 'יום חמישי, 06 ביולי 2023',
      location: 'גן האירועים "YARA" בשרון, כביש עוקף קיסריה, גן שמואל',
      times: 'קבלת פנים: 19:30 חופה וקידושין: 20:30',
      footer: 'אנא אשרו הגעה',
    };
    this.formText = {
      nameLabel: 'שם:',
      guestsLabel: 'מס\' אורחים:',
      namePlaceholder: 'הכניסו שם',
      guestsPlaceholder: 'הכניסו מספר אורחים',
      sendButton: 'שלח אישור'
    };
    this.response = 'coming';
    this.responseOptions = [
      { value: 'coming', text: 'Coming', textHe: 'מגיעים' },
      { value: 'notComing', text: 'Not Coming', textHe: 'לא מגיעים' },
      { value: 'unsure', text: 'Unsure', textHe: 'לא בטוחים' } 
    ];
    this.buttonDisabled = false;
    this.thankYouText = 'מתרגשים? גם אנחנו! לחצו לניווט:'
    this.thankYouImgSrc = 'assets\\thank-you-he.jpeg';
  }

  changeLanguage() {
    // Perform any language change related actions here
    console.log(`Language changed to ${this.selectedLanguage}`);
    if (this.selectedLanguage === 'he-IL') {
      this.isRTL = true;
      this.fontFamily = 'Amatic SC';
      this.invitationText.names = 'אפי ואפרת';
      this.invitationText.title = 'מתחתנים';
      this.invitationText.date = 'חמישי, 06 ביולי 2023';
      this.invitationText.location = 'גן האירועים "YARA" בשרון, כביש עוקף קיסריה, גן שמואל';
      this.invitationText.times = 'קבלה: 19:30 חופה וקידושין: 20:30';
      this.invitationText.footer = 'אנא אשרו הגעה';
      this.formText = {
        nameLabel: 'שם:',
        guestsLabel: 'מס\' אורחים:',
        namePlaceholder: 'הכניסו שם',
        guestsPlaceholder: 'הכניסו מספר האורחים',
        sendButton: 'שלח אישור'
      };
      this.thankYouImgSrc = 'assets\\thank-you-he.jpeg';
    } else {
      this.isRTL = false;
      this.fontFamily = 'Dancing Script';
      // this.fontFamily = 'Great Vibes';
      this.invitationText.names = 'Efi & Effie';
      this.invitationText.title = 'are getting married',
      this.invitationText.date = 'Thursday, 06 July 2023',
      this.invitationText.location = 'YARA Garden, HaSharon, Caesarea bypass road, Gan Shmuel';
      this.invitationText.times = 'Reception: 19:30 Ceremony: 20:30';
      this.invitationText.footer = 'Let us know if you\'re coming';
      this.thankYouText = 'Excited? Us too! Press to navigate:'
      this.formText = {
        nameLabel: 'Name:',
        guestsLabel: 'No. of Guests:',
        namePlaceholder: 'Enter your name',
        guestsPlaceholder: 'Enter the number of guests',
        sendButton: 'Send Confirmation'
      };
      this.thankYouImgSrc = 'assets\\thank-you-en.jpeg';
    }
  }

  sendEmail(emailData: any): Observable<any> {
    return this.http.post('/.netlify/functions/send-email', emailData);
  }

  writeToFirestore(dbData: any): Observable<any> {
    return this.http.post('/.netlify/functions/create-firestore-entry', dbData);
  }

  async sendConfirmation() {
    this.buttonDisabled = true;

    if (!this.name) {
      alert('Please enter a name');
      this.buttonDisabled = false;
      return;
    }

    if (!(this.guests < 20 && this.guests >= 0) || !Number.isInteger(this.guests))
    {
      alert('The number of guests is invalid');
      this.buttonDisabled = false;
      return;
    }

    const emailData = {
      to: 'efiandeffie@gmail.com',
      from: 'efiandeffie@gmail.com',
      subject: 'RSVP '+this.name+ ': ' +this.response+ ' - '+this.guests+' people'
    };

    const dbData = {
      name: this.name,
      guests: this.guests,
      response: this.response,
    };

    try {
      const results = await Promise.allSettled([
        this.sendEmail(emailData).toPromise(),
        this.writeToFirestore(dbData).toPromise(),
      ]);

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          console.log(`Function ${index + 1} succeeded with value:`, result.value);
        } else {
          console.log(`Function ${index + 1} failed with reason:`, result.reason);
        }
      });
    
      const allFailed = results.every(result => result.status == 'rejected');

      if (allFailed) {
        this.buttonDisabled = false;
        alert("An error has occurred :( --- Please tell Efi!")
      }
      else {
        alert("Your response was sent! Thank you ♥")
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      this.buttonDisabled = false;
    }
  }
}
