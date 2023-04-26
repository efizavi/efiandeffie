import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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

  constructor(private http: HttpClient) {
    this.selectedLanguage = 'he-IL';
    this.fontFamily = 'Amatic SC'
    this.isRTL = true;
    this.invitationText = {
      names: 'אפי ואפרת',
      title: 'מתחתנים',
      date: 'יום חמישי, 06 ביולי 2023',
      location: 'גן האירועים "YARA" בשרון כביש עוקף קיסריה, גן שמואל',
      times: 'קבלה: 19:30 חופה וקידושין: 20:30',
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
      this.invitationText.location = 'גן האירועים "YARA" בשרון כביש עוקף קיסריה, גן שמואל';
      this.invitationText.times = 'קבלה: 19:30 חופה וקידושין: 20:30';
      this.invitationText.footer = 'אנא אשרו הגעה';
      this.formText = {
        nameLabel: 'שם:',
        guestsLabel: 'מס\' אורחים:',
        namePlaceholder: 'הכניסו שם',
        guestsPlaceholder: 'הכניסו מספר האורחים',
        sendButton: 'שלח אישור'
      };
    } else {
      this.isRTL = false;
      this.fontFamily = 'Dancing Script';
      // this.fontFamily = 'Great Vibes';
      this.invitationText.names = 'Efi & Effie';
      this.invitationText.title = 'are getting married',
      this.invitationText.date = 'Thursday, 06 July 2023',
      this.invitationText.location = 'YARA Garden, HaSharon Caesarea bypass road, Gan Shmuel';
      this.invitationText.times = 'Reception: 19:30 Ceremony: 20:30';
      this.invitationText.footer = 'Let us know if you\'re coming';
      this.formText = {
        nameLabel: 'Name:',
        guestsLabel: 'No. of Guests:',
        namePlaceholder: 'Enter your name',
        guestsPlaceholder: 'Enter the number of guests',
        sendButton: 'Send Confirmation'
      };
    }
  }

  sendConfirmation(): void {
    if (!this.name) {
      alert('Please enter a name');
      return;
    }

    const data = {
      name: this.name,
      guests: this.guests
    };

    this.http.post('https://your-backend-api.com/confirmations', data).subscribe(
      (response) => {
        alert('Confirmation sent successfully!');
      },
      (error) => {
        alert('Error sending confirmation. Please try again.');
      }
    );
  }
}
