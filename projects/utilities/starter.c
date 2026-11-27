/* Starter: implement TODOs using README contract. */
#define _POSIX_C_SOURCE 200809L
#include <errno.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h>
#include <unistd.h>

static int cat_files(int n,char **p){(void)n;(void)p;/* TODO bounded fread/fwrite */return 2;}
static int grep_file(char *pattern,char *p){(void)pattern;(void)p;/* TODO getline and literal search */return 2;}
static int rle_file(char *p){(void)p;/* TODO byte/count runs, flush EOF */return 2;}
int main(int argc,char **argv){
 if(argc>=3&&!strcmp(argv[1],"cat"))return cat_files(argc-2,argv+2);
 if(argc==4&&!strcmp(argv[1],"grep"))return grep_file(argv[2],argv[3]);
 if(argc==3&&!strcmp(argv[1],"rle"))return rle_file(argv[2]);
 fprintf(stderr,"usage: cat FILE... | grep PATTERN FILE | rle FILE\n");return 2;
}
