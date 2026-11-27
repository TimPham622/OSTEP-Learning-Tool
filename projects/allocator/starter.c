/* Starter: implement TODOs using README contract. */
#define _POSIX_C_SOURCE 200809L
#include <errno.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h>
#include <unistd.h>

enum {ARENA=128, ALIGN=8};
typedef struct {size_t start,len;int used;} Span;
static Span spans[ARENA/ALIGN+1]={{0,ARENA,0}};static size_t count=1;
static int alloc_span(size_t n){(void)n;(void)spans;(void)count;/* TODO split */return -1;}
static int free_span(size_t off){(void)off;/* TODO validate/coalesce */return 0;}
static int check(void){/* TODO verify partition */return 0;}
int main(void){char line[128],op[16];size_t n;
 while(fgets(line,sizeof line,stdin)){int k=sscanf(line,"%15s %zu",op,&n);
 if(k==2&&!strcmp(op,"alloc"))printf("%d\n",alloc_span(n));
 else if(k==2&&!strcmp(op,"free"))puts(free_span(n)?"ok":"error");
 else if(k==1&&!strcmp(op,"check"))puts(check()?"ok":"error");
 else puts("error");}return ferror(stdin)?1:0;}
