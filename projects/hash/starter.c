/* Starter: implement TODOs using README contract. */
#define _POSIX_C_SOURCE 200809L
#include <errno.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h>
#include <unistd.h>

#include <pthread.h>
enum{BUCKETS=4};
typedef struct Node{size_t key;uint64_t count;struct Node *next;}Node;
typedef struct{pthread_mutex_t lock;Node *head;}Bucket;
typedef struct{size_t iterations,keys;Bucket *buckets;}Args;
static void *worker(void *p){Args *a=p;(void)a;/* TODO synchronized insert/increment */return NULL;}
int main(int argc,char **argv){if(argc!=4){fprintf(stderr,"usage: THREADS ITERATIONS KEYS\n");return 2;}
 /* TODO parse bounded args, init buckets, create stable workers, join, print counts, cleanup. */
 (void)argv;(void)worker;return 2;}
