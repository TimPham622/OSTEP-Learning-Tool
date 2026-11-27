/* Starter: implement TODOs using README contract. */
#define _POSIX_C_SOURCE 200809L
#include <errno.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h>
#include <unistd.h>

typedef struct{int id,arrival,burst,remaining,first,completion;}Job;
int main(int argc,char **argv){if(argc<4){fprintf(stderr,"usage: FIFO|SJF|STCF|RR QUANTUM ARRIVAL:BURST...\n");return 2;}
 /* TODO parse; ready set/queue, tick loop, completion and first dispatch; print in ID order. */
 (void)argv;return 2;}
