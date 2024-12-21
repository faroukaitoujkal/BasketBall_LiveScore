import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function uniqueTeamsValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const homeTeamId = control.get('homeTeamId')?.value;
    const awayTeamId = control.get('awayTeamId')?.value;

    return homeTeamId === awayTeamId ? { uniqueTeams: true } : null;
  };
}
