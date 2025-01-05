import { Injectable } from '@angular/core';
import signalR, { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SignalrService {
  private hubConnection: HubConnection;
  private messageReceivedSubject = new Subject<string>();
  public messageReceived$ = this.messageReceivedSubject.asObservable();
  private scoreUpdatedSource = new BehaviorSubject<any>(null);
  private timeoutCreatedSource = new BehaviorSubject<any>(null);

  scoreUpdated$ = this.scoreUpdatedSource.asObservable();
  timeoutCreated$ = this.timeoutCreatedSource.asObservable();

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
      })
      .catch((err) => {
        console.error('SignalR connection failed: ', err);
      });

    this.listenToScoreUpdates();
    this.listenToTimeoutCreated(); 
  }

  public listenForMessages(): void {
    this.hubConnection.on('ReceiveMessage', (message: string) => {
      console.log('Message reçu :', message);
      this.messageReceivedSubject.next(message);
    });
  }

  private listenToScoreUpdates(): void {
    this.hubConnection.on('ScoreUpdated', (data) => {
      console.log('Score mis à jour reçu:', data);
      this.scoreUpdatedSource.next(data);
    });
  }

  private listenToTimeoutCreated(): void {
    this.hubConnection.on('TimeoutCreated', (data) => {
      console.log('Temps mort créé reçu:', data);
      this.timeoutCreatedSource.next(data);
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

  public getConnectionId(): void {
    this.hubConnection.invoke('GetConnectionId')
      .then((connectionId: string) => {
        console.log('Connection ID:', connectionId);
      })
      .catch((err) => {
        console.error('Error retrieving Connection ID:', err);
      });
  }
}
