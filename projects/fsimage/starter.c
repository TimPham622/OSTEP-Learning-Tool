/* Starter: implement TODOs using README contract. */
#define _POSIX_C_SOURCE 200809L
#include <errno.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h>
#include <unistd.h>

#include <sys/stat.h>
#include <fcntl.h>
enum{INODES=8,BLOCKS=32,BLOCK_SIZE=64,NAME_SIZE=16};
typedef struct{unsigned used,block,len;char name[NAME_SIZE];}Inode;
typedef struct{uint32_t bitmap;Inode inode[INODES];unsigned char data[BLOCKS][BLOCK_SIZE];}Image;
/* TODO explicit encode/decode and validate before indexing; do not serialize padding. */
static int validate(const Image *im){(void)im;return 0;}
int main(int argc,char **argv){if(argc<3){fprintf(stderr,"usage: init|put|get|rm|check|put-crash IMAGE ...\n");return 2;}
 /* TODO dispatch, checked allocation, unique temp sibling + rename; simulated crash returns 0. */
 (void)argv;(void)validate;return 2;}
