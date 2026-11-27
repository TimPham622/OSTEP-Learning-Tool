/* Starter: implement TODOs using README contract. */
#define _POSIX_C_SOURCE 200809L
#include <errno.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h>
#include <unistd.h>

typedef struct{int page,valid,referenced;size_t inserted,last;}Frame;
int main(int argc,char **argv){if(argc<3){fprintf(stderr,"usage: FIFO|LRU|OPT|CLOCK CAPACITY PAGE...\n");return 2;}
 /* TODO parse, allocate frames, hit/evict logic, miss count. */
 (void)argv;return 2;}
