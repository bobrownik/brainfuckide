(function(){
    'use strict';

angular.module('brainfuckApp', [])


angular.module('brainfuckApp').controller('brainfuckController', function($scope, $timeout) {

    $scope.memory = new Array();
    $scope.memory[0]=0;
    $scope.memoryPointer = 0;
    $scope.codePointer = 0;
    $scope.code = "++++++++++[>+++++++>++++++++++>+++>+<<<<-]>++.>+.+++++++..+++.>++.<<+++++++++++++++.>.+++.------.--------.>+.>.";
    $scope.isDebuging = false;
    $scope.isRunning = false;
    $scope.output_text = '';

    $scope.Command = {};

    $scope.Command['>'] = function($scope) {
        $scope.memoryPointer++;
        if($scope.memory.length==$scope.memoryPointer)
            $scope.memory[$scope.memoryPointer]=0;
    }
    $scope.Command['<'] = function($scope) {
        $scope.memoryPointer--;
        if($scope.memoryPointer<0) $scope.error("negative memory index");
    }
    $scope.Command['+'] = function($scope) {
        if($scope.memory[$scope.memoryPointer]<255)
            $scope.memory[$scope.memoryPointer]+=1;
        else  $scope.memory[$scope.memoryPointer]=0;
    }
    $scope.Command['-'] = function($scope) {
        if($scope.memory[$scope.memoryPointer]>0)
            $scope.memory[$scope.memoryPointer]-=1;
        else  $scope.memory[$scope.memoryPointer]=255;
    }
    $scope.Command[','] = function($scope) {
        $scope.memory[$scope.memoryPointer]=$scope.input();
    }

    $scope.Command['.'] = function($scope) {
        $scope.output($scope.memory[$scope.memoryPointer]);
    }

    $scope.Command['['] = function($scope) {
        if ($scope.memory[$scope.memoryPointer] == 0) $scope.to_loop_end();
    }
    $scope.Command[']'] = function($scope) {
        if ($scope.memory[$scope.memoryPointer] > 0)
            $scope.to_loop_start();
    }

    $scope.reset = function () {
        this.memory = new Array();
        this.memory[0]=0;
        this.memoryPointer = 0;
        this.codePointer = 0;
        this.isStarted = false;
        this.isRunning = false;
        this.isFinished = false;
    };

    $scope.to_loop_end=function(){
        for(var loops  = 1; loops!=0; this.code_step_forward())
            if(this.code[this.codePointer+1]==']')  loops-=1;
            else if(this.code[this.codePointer+1]=='[') loops+=1;
    }

    $scope.to_loop_start=function(){
        for(var loops  = 1; loops!=0; this.code_step_backwards())
            if(this.code[this.codePointer-1]==']')  loops+=1;
            else if(this.code[this.codePointer-1]=='[') loops-=1;
    }
    $scope.code_step_forward=function(){
        this.codePointer+=1;
        if(this.code.length==this.codePointer)
            this.error("unexpected end of code");
    }
    $scope.code_step_backwards=function(){
        this.codePointer-=1;
        if(this.codePointer<0)
            this.error("unexpected end of code");
    }

    $scope.execute = function(){
        if(!this.Command[this.code[this.codePointer]]){
            alert(this.code[this.codePointer]);
            this.error('unexpected symbol');
        }
        this.Command[this.code[this.codePointer]]($scope);
    }

    $scope.step = function() {
        this.execute();
        this.codePointer+=1;
        if (!this.code[this.codePointer]) {
            this.isRunning=false;
            this.isDebuging=false;
        }
    }
    $scope.run=function(){
        this.isRunning = true;
        while(this.isRunning == true){
            setTimeout(1000);
            this.step();
        }
    }
    $scope.error = function(message){
        alert(message);
        this.reset();
    }
    $scope.input = function() {
        while (true){
            let char = prompt("enter data (1 character)");
            if(!char) this.reset();
            if (char.length==1){
                let char_code=char.charCodeAt(0);
                if(char_code>-1 && char_code<256)
                    return char_code;
        }
    }
    }
    $scope.output = function(a){
        this.output_text+=String.fromCharCode(a);
    }
});
})();