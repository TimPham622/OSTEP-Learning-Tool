/* Starter: implement TODOs using README contract. */
#define _POSIX_C_SOURCE 200809L
#include <errno.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h>
#include <unistd.h>

#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <sys/time.h>
typedef struct{unsigned long id;int op,value,valid;}Entry;
static int server(char *mode){(void)mode;/* TODO loopback bind, port, bounded parse, dedup */return 2;}
static int client(char *port,char *id,char *op){(void)port;(void)id;(void)op;/* TODO timeout and same-ID retry */return 2;}
int main(int argc,char **argv){
 if(argc==3&&!strcmp(argv[1],"server"))return server(argv[2]);
 if(argc==5&&!strcmp(argv[1],"client"))return client(argv[2],argv[3],argv[4]);
 fprintf(stderr,"usage: server normal|drop-first | client PORT ID inc|set\n");return 2;}
