import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';  
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SignalrService {
  matchId!: number; // MatchId sera initialisé dynamiquement
  public hubConnection: HubConnection;
  private messageReceivedSubject = new Subject<string>();
  public messageReceived$ = this.messageReceivedSubject.asObservable();
  private scoreUpdatedSource = new BehaviorSubject<any>(null);
  private timeoutCreatedSource = new BehaviorSubject<any>(null);
  private timerUpdatedSource = new BehaviorSubject<any>(null);
  private _currentQuarterUpdated = new Subject<number>();

  scoreUpdated$ = this.scoreUpdatedSource.asObservable();
  timeoutCreated$ = this.timeoutCreatedSource.asObservable();
  timerUpdated$ = this.timerUpdatedSource.asObservable();
  currentQuarterUpdated$ = this._currentQuarterUpdated.asObservable();

  constructor() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl('/basketBallHub') 
      .configureLogging(LogLevel.Information)
      .build();
  }

  public startConnection(matchId: number): void {
    this.matchId = matchId;

    if (this.hubConnection.state === signalR.HubConnectionState.Disconnected) {
      this.hubConnection
        .start()
        .then(() => {
        })
        .catch((err: any) => {
          console.error('SignalR connection failed: ', err);
        });
    } else {
    }

    this.listenToScoreUpdates();
    this.listenToTimeoutCreated();
    this.listenForQuarterUpdates();
  }

  public listenForMessages(): void {
    this.hubConnection.on('ReceiveMessage', (message: string) => {
      this.messageReceivedSubject.next(message);
    });
  }

  private listenToScoreUpdates(): void {
    this.hubConnection.on('ScoreUpdated', (data: any) => {
      this.scoreUpdatedSource.next(data);
    });
  }

  private listenToTimeoutCreated(): void {
    this.hubConnection.on('TimeoutCreated', (data: any) => {
      this.timeoutCreatedSource.next(data);
    });
  }

  listenForQuarterUpdates(): void {
    this.hubConnection.on('QuarterUpdated', (quarter: number) => {
      this._currentQuarterUpdated.next(quarter); 
    });
  }

  updateCurrentQuarter(matchId: number, currentQuarter: number): void {
    this.hubConnection
      .invoke('UpdateQuarter', matchId, currentQuarter)
      .catch((err: any) => console.error('Error sending quarter update:', err));
  }

  public sendMessage(message: string): void {
    this.hubConnection.invoke('SendMessage', message)
      .then(() => {
      })
      .catch((err: any) => {
        console.error('Erreur d\'envoi du message :', err);
      });
  }

  public getConnectionId(): void {
    this.hubConnection.invoke('GetConnectionId')
      .then((connectionId: string) => {
      })
      .catch((err: any) => {
        console.error('Error retrieving Connection ID:', err);
      });
  }
}
