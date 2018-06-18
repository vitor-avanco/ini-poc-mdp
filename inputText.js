(function () {
    'use strict';

    angular
        .module('inputForm', ['ngMin'])
        .directive('inputForm', directive);

    directive.$inject = ['$window'];

    function directive($window) {
        // Usage:
        //     <directive></directive>
        // Creates:
        //

        let template = function (element, attr) {
            return `
                <div ng-messages="form.` + attr.name + `.$error" role="alert" ng-show="form.` + attr.name + `.$touched && ` + attr.name + `HasFocus == false">
                    <div ng-message-exp="'required'">You did not enter your email address</div>
                    <div ng-message-exp="'ngMin'">
                        Your email must be between 80 e 1200
                    </div>
                </div>
                    <input type='text' money-mask class='form-control' ng-min="'80.00 - 1200.00'" ng-max="1020.00" name='{{name}}' ng-model='input.` + attr.name + `' ng-focus='` + attr.name + `HasFocus = true' ng-blur='` + attr.name + `HasFocus = false' required>
                    <span ng-bind="input.` + attr.name + `"></span>
                    {{form.` + attr.name + `.$error}}
            `
        };
        let directive = {
            priority: 3,
            require: ['^form', 'ngModel'],
            template: template,
            link: link,
            restrict: 'E',
            scope: {
                name: '@'
            }
        };
        return directive;

        function link(scope, element, attrs, ctrls) {
            scope.form = ctrls[0];
            let ngModel = ctrls[1];
            if (attrs.required !== undefined) {
                scope.required = true;
            }

            scope.$watch(name, function () {
                ngModel.$setViewValue(scope.name);
            });
        }
    }
})();




(function () {
    'use strict';

    angular
        .module('ngMin', [])
        .directive('ngMin', directive);

    directive.$inject = ['$window'];

    function directive($window) {
        var directive = {
            priority: 2,
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, elem, attr, ctrl) {
                scope.$watch(attr.ngMin, function () {
                    ctrl.$setViewValue(ctrl.$viewValue);
                });
                var minValidator = function (value) {
                    var valor = attr.ngMin || 0;
                    
                    if(valor != 0){
                        var valorMinimo = valor.split(' - ')[0];
                        valorMinimo = parseFloat(valorMinimo);

                        var valorMaximo = valor.split(' - ')[1];
                        valorMaximo = parseFloat(valorMaximo);
                    }

                    if(value !== undefined){
                        var valorDigitado = parseFloat(value.replace(/\./g, '').replace(/,/g, '.').replace(/[^\d.]/g, ''));
                    }
                    
                    if (valorMinimo > valorDigitado || valorMaximo < valorDigitado) {
                        ctrl.$setValidity('ngMin', false);
                        return undefined;
                    } else {
                        ctrl.$setValidity('ngMin', true);
                        return value;
                    }
                };
                setTimeout(function(){
                    ctrl.$parsers.push(minValidator);
                    ctrl.$formatters.push(minValidator);
                },500)
                
            }
        };
        return directive;
    }
})();
