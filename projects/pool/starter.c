/* Starter: implement TODOs using README contract. */
#define _POSIX_C_SOURCE 200809L
#include <errno.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h>
#include <unistd.h>

#include <pthread.h>
typedef struct{uint64_t *items;size_t cap,head,tail,count;int closed;pthread_mutex_t lock;pthread_cond_t not_empty,not_full;}Queue;
typedef struct{Queue *q;uint64_t count,sum;}Worker;
static void *consume(void *p){Worker *w=p;(void)w;/* TODO wait predicate, remove, signal, sum */return NULL;}
int main(int argc,char **argv){if(argc!=4){fprintf(stderr,"usage: WORKERS CAPACITY TASKS\n");return 2;}
 /* TODO parse, init, start workers, enqueue, close+broadcast, join, aggregate, destroy. */
 (void)argv;(void)consume;return 2;}
