/* Starter: implement TODOs using README contract. */
#define _POSIX_C_SOURCE 200809L
#include <errno.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h>
#include <unistd.h>

#include <sys/wait.h>
#include <fcntl.h>
/* Return 1 for exit, 0 to continue. TODO parse operators, built-ins, fork/exec/wait. */
static int execute(char **args,size_t n){(void)args;(void)n;fprintf(stderr,"TODO\n");return 0;}
int main(void){char *line=NULL;size_t cap=0;
 while(getline(&line,&cap,stdin)>=0){char *args[128],*save=NULL;size_t n=0;
 for(char *t=strtok_r(line," \t\r\n",&save);t;t=strtok_r(NULL," \t\r\n",&save)){
 if(n==127){n=0;fprintf(stderr,"too many tokens\n");break;}args[n++]=t;}
 args[n]=NULL;if(n&&execute(args,n))break;}
 free(line);return ferror(stdin)?1:0;}
