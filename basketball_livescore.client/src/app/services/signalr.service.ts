import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SignalrService {
  private hubConnection: HubConnection;
  private messageReceivedSubject = new Subject<string>();
  public messageReceived$ = this.messageReceivedSubject.asObservable();

  constructor() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl('https://localhost:7088/basketBallHub') 
      .configureLogging(LogLevel.Information)
      .build();
  }

  public startConnection(): void {
    this.hubConnection
      .start()
      .then(() => {
        console.log('SignalR connection established');
        this.listenForMessages();
      })
      .catch((err) => {
        console.error('SignalR connection failed: ', err);
      });
  }

  public listenForMessages(): void {
    this.hubConnection.on('ReceiveMessage', (message: string) => {
      console.log('Message reçu :', message);
      this.messageReceivedSubject.next(message);
    });
  }

  public sendMessage(message: string): void {
    this.hubConnection.invoke('SendMessage', message)
      .then(() => {
        console.log('Message envoyé');
      })
      .catch((err) => {
        console.error('Erreur d\'envoi du message :', err);
      });
  }
}
