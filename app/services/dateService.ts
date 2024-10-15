import { differenceInDays, differenceInHours, isBefore, isAfter } from 'date-fns';

import { parseISO } from 'date-fns/parseISO';

// Fonction pour calculer la différence en jours
export const calculateDaysDifference = (date1: string, date2: string): string => {
    const parsedDate1 = parseISO(date1);
    const parsedDate2 = parseISO(date2);
    const daysDifference = differenceInDays(parsedDate2, parsedDate1) + 1;
    return daysDifference.toString();
};

// Fonction pour calculer la différence en heures
export const calculateHoursDifference = (date1: string, date2: string): string => {
    const parsedDate1 = parseISO(date1);
    const parsedDate2 = parseISO(date2);
    const hoursDifference = differenceInHours(parsedDate2, parsedDate1) + 24;
    return hoursDifference.toString();
};

export const compareDateRanges = (taskDates: { start: string; end: string }, actionDates: { start: string; end: string }): { isValid: boolean; messages: string[] } => {
    const { start: taskStart, end: taskEnd } = taskDates;
    const { start: actionStart, end: actionEnd } = actionDates;

    const parsedTaskStart = parseISO(taskStart);
    const parsedTaskEnd = parseISO(taskEnd);
    const parsedActionStart = parseISO(actionStart);
    const parsedActionEnd = parseISO(actionEnd);

    let isValid = true;
    const messages: string[] = [];

    if (isBefore(parsedActionStart, parsedTaskStart)) {
        messages.push(`La date de début de l'action doit être égale ou postérieure à la date de début de la tâche. ${taskStart}`);
        isValid = false;
    }

    if (isAfter(parsedActionEnd, parsedTaskEnd)) {
        messages.push(`La date de fin de l'action doit être égale ou antérieure à la date de fin de la tâche : ${taskEnd}`);
        isValid = false;
    }

    return { isValid, messages };
};

export const compareDateRangesTask = (taskDates: { start: string; end: string }, actionDates: { start: string; end: string }): { isValid: boolean; messages: string[] } => {
    const { start: taskStart, end: taskEnd } = taskDates;
    const { start: actionStart, end: actionEnd } = actionDates;

    const parsedTaskStart = parseISO(taskStart);
    const parsedTaskEnd = parseISO(taskEnd);
    const parsedActionStart = parseISO(actionStart);
    const parsedActionEnd = parseISO(actionEnd);

    let isValid = true;
    const messages: string[] = [];

    if (isBefore(parsedActionStart, parsedTaskStart)) {
        messages.push(`La date de début de la tâche doit être égale ou postérieure à la date de début du projet. ${taskStart}`);
        isValid = false;
    }

    if (isAfter(parsedActionEnd, parsedTaskEnd)) {
        messages.push(`La date de fin de la tâche doit être égale ou antérieure à la date de fin du projet: ${taskEnd}`);
        isValid = false;
    }

    return { isValid, messages };
};

