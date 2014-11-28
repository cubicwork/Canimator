/*
Canimator v1.0
By Carney Wu  Github: https://github.com/cubicwork
this code is under the terms of the GNU General Public License as published by the Free Software Foundation either version 3, or (at your option) any later version. http://www.gnu.org/licenses/gpl.html
Please do not remove this comment when used.
*/
function Canimator( dom)
	{
		var self = this;
		self.dom = dom;
		self.animatorStatus = 'stop';
		self.animationArray = Array();
		self.listenerCallBackStack = Array();
		self.listenerCallBackStack['frame'] = Array();
		self.listenerCallBackStack['play'] = Array();
		self.listenerCallBackStack['pause'] = Array();
		self.listenerCallBackStack['stop'] = Array();
		self.listenerCallBackStack['goon'] = Array();
		self.currentAnimationFrame = 1;
		self.maxAnimationFrame = 0;
		self.add = function( propertyString, amount, duration, mathType)
			{
				if( propertyString == 'alpha' )
					{
						propertyString = 'style.opacity';
						self.animationArray[propertyString] = Array();
						mathType = mathType ? mathType : 'sine';
						self.animationArray[propertyString]['amount'] = amount;
						self.animationArray[propertyString]['duration'] = duration;
						self.animationArray[propertyString]['mathType'] = mathType;
						self.animationArray[propertyString]['frame'] = Math.ceil( duration * 0.06);
						self.animationArray[propertyString]['startAttribute'] = eval( 'self.dom.'+ propertyString ) ? eval( 'self.dom.'+ propertyString ) : '1';
						propertyString = 'style.mozOpacity';
						self.animationArray[propertyString] = Array();
						mathType = mathType ? mathType : 'sine';
						self.animationArray[propertyString]['amount'] = amount;
						self.animationArray[propertyString]['duration'] = duration;
						self.animationArray[propertyString]['mathType'] = mathType;
						self.animationArray[propertyString]['frame'] = Math.ceil( duration * 0.06);
						self.animationArray[propertyString]['startAttribute'] = eval( 'self.dom.'+ propertyString ) ? eval( 'self.dom.'+ propertyString ) : '1';
						propertyString = 'style.filter';
						self.animationArray[propertyString] = Array();
						mathType = mathType ? mathType : 'sine';
						self.animationArray[propertyString]['amount'] = 'alpha(opacity='+ ( amount * 100 ) +')';
						self.animationArray[propertyString]['duration'] = duration;
						self.animationArray[propertyString]['mathType'] = mathType;
						self.animationArray[propertyString]['frame'] = Math.ceil( duration * 0.06);
						self.animationArray[propertyString]['startAttribute'] = eval( 'self.dom.'+ propertyString ) ? eval( 'self.dom.'+ propertyString ) : 'alpha(opacity=100)';
						self.maxAnimationFrame = ( self.maxAnimationFrame > self.animationArray[propertyString]['frame'] ) ? self.maxAnimationFrame : self.animationArray[propertyString]['frame'];
					}
				else
					{
						self.animationArray[propertyString] = Array();
						mathType = mathType ? mathType : 'sine';
						self.animationArray[propertyString]['amount'] = amount;
						self.animationArray[propertyString]['duration'] = duration;
						self.animationArray[propertyString]['mathType'] = mathType;
						self.animationArray[propertyString]['frame'] = Math.ceil( duration * 0.06);
						self.animationArray[propertyString]['startAttribute'] = eval( 'self.dom.'+ propertyString ) ? eval( 'self.dom.'+ propertyString ) : '';
						self.maxAnimationFrame = ( self.maxAnimationFrame > self.animationArray[propertyString]['frame'] ) ? self.maxAnimationFrame : self.animationArray[propertyString]['frame'];
					}
			}
		self.start = function()
			{
				if( self.animatorStatus == 'stop' || self.animatorStatus == 'play' )
					{
						if( self.animatorStatus == 'stop' )
							{
								self.executeCallBack( self.listenerCallBackStack['play']);
							}
						if( self.currentAnimationFrame <= self.maxAnimationFrame )
							{
								for( var index in self.animationArray )
									{
										if(  self.currentAnimationFrame <= self.animationArray[index]['frame'] )
											{
												self.setFrameAttribute( index);
											}
									}
								self.executeCallBack( self.listenerCallBackStack['frame']);
								self.currentAnimationFrame ++;
								self.animatorStatus = 'play';
								try
									{
										requestAnimationFrame( self.start);
									}
								catch(e)
									{
										setTimeout( self.start, 17);
									}
							}
						else
							{
								self.stop();
								for( index in self.animationArray )
									{
										self.animationArray[index]['startAttribute'] =  eval( 'self.dom.'+ index );
									}
							}
					}
			}
		self.pause = function()
			{
				self.animatorStatus = 'pause';
				self.executeCallBack( self.listenerCallBackStack['pause']);
			}
		self.goon = function()
			{
				self.animatorStatus = 'play';
				self.executeCallBack( self.listenerCallBackStack['goon']);
				self.start();
			}
		self.stop = function()
			{
				self.currentAnimationFrame = 1;
				self.animatorStatus = 'stop';
				self.executeCallBack( self.listenerCallBackStack['stop']);
			}
		self.clear = function( withEventListener)
			{
				self.animationArray.length = 0;
				self.currentAnimationFrame = 1;
				self.maxAnimationFrame = 0;
				self.animatorStatus = 'stop';
				withEventListener = withEventListener ? withEventListener : false;
				if( withEventListener)
					{
						self.clearEventListener();
					}
			}
		self.setFrameAttribute = function( index)
			{
				var dataArray = self.animationArray[index];
				var currentPercent =  self.currentAnimationFrame / dataArray['frame'];
				var currentPercentAmount = self.getPercentCurrentAmount( currentPercent, dataArray['mathType']);
				var currentAmount = self.attributeMultiplier( currentPercentAmount, dataArray['amount']);
				var currentAttributeValue = self.attributeAdder( dataArray['startAttribute'], currentAmount);
				eval( 'self.dom.' + index + '= "' + currentAttributeValue + '"');
			}
		self.attributeMultiplier = function( percent, amount)
			{
				var returnValue = '';
				var returnValuePrefix = '';
				amount = amount + '';
				if( amount.search( '#') != -1 )
					{
						if( amount.match('-#') )
							{
								amount = amount.replace( '-#', '');
								returnValuePrefix = '-';
							}
						else
							{
								amount = amount.replace( '#', '');
							}
						var amount_r = Math.floor( ( parseInt( '0x' + amount.slice( 0, 2) ) * percent ) ).toString(16);
						var amount_g = Math.floor( ( parseInt( '0x' + amount.slice( 2, 4) ) * percent ) ).toString(16);
						var amount_b = Math.floor( ( parseInt( '0x' + amount.slice( 4, 6) ) * percent ) ).toString(16);
						amount_r = ( amount_r.length == 1 ) ? ( '0' + amount_r ) : amount_r;
						amount_g = ( amount_g.length == 1 ) ? ( '0' + amount_g ) : amount_g;
						amount_b = ( amount_b.length == 1 ) ? ( '0' + amount_b ) : amount_b;
						returnValue = returnValuePrefix + '#' + amount_r + amount_g + amount_b;
					}
				else if ( amount.search( 'px') != -1 )
					{
						amount = parseInt( amount.replace( 'px', ''));
						returnValue = Math.floor( amount * percent) + 'px';
					}
				else if ( amount.search( 'alpha') != -1 )
					{
						amount = parseInt( amount.match(/-?\d+/) );
						returnValue = 'alpha(opacity='+ Math.floor( amount * percent) +')';
					}
				else
					{
						returnValue = percent * amount;
					}
				return returnValue;
			}
		self.attributeAdder = function ( value, amount)
			{
				var returnValue = '';
				var returnValuePrefix = '';
				amount = amount + '';
				if( amount.search( '#') != -1 )
					{
						if( amount.match('-#') )
							{
								amount = amount.replace( '-#', '');
								returnValuePrefix = '-';
							}
						else
							{
								amount = amount.replace( '#', '');
							}
						if( value.search( 'rgb') != -1 )
							{
								value = value.replace( 'rgb(', '');
								value = value.replace( ')', '');
								value = value.split(',');
								var amount_r = Math.floor( parseInt( returnValuePrefix + '0x' + amount.slice( 0, 2) ) + parseInt( value[0] ) ).toString(16);
								var amount_g = Math.floor( parseInt( returnValuePrefix + '0x' + amount.slice( 2, 4) ) + parseInt( value[1] ) ).toString(16);
								var amount_b = Math.floor( parseInt( returnValuePrefix + '0x' + amount.slice( 4, 6) ) + parseInt( value[2] ) ).toString(16);
							}
						else
							{
								value = value.replace( '#', '');
								var amount_r = Math.floor( parseInt( returnValuePrefix + '0x' + amount.slice( 0, 2) ) + parseInt( '0x' + value.slice( 0, 2) ) ).toString(16);
								var amount_g = Math.floor( parseInt( returnValuePrefix + '0x' + amount.slice( 2, 4) ) + parseInt( '0x' + value.slice( 2, 4) ) ).toString(16);
								var amount_b = Math.floor( parseInt( returnValuePrefix + '0x' + amount.slice( 4, 6) ) + parseInt( '0x' + value.slice( 4, 6) ) ).toString(16);
							}
						amount_r = ( amount_r.length == 1 ) ? ( '0' + amount_r ) : amount_r;
						amount_g = ( amount_g.length == 1 ) ? ( '0' + amount_g ) : amount_g;
						amount_b = ( amount_b.length == 1 ) ? ( '0' + amount_b ) : amount_b;
						returnValue =  '#' + amount_r + amount_g + amount_b;
					}
				else if ( amount.search( 'px') != -1 )
					{
						amount = parseInt( amount.replace( 'px', ''));
						value = parseInt( value.replace( 'px', ''));
						returnValue = Math.floor( amount + value) + 'px';
					}
				else if ( amount.search( 'alpha') != -1 )
					{
						amount = parseInt( amount.match(/-?\d+/) );
						value = parseInt( value.match(/-?\d+/) );
						returnValue = 'alpha(opacity='+ Math.floor( amount + value) +')';
					}
				else
					{
						returnValue = parseFloat( value) + parseFloat( amount);
					}
				return returnValue;
			}
		self.getPercentCurrentAmount = function( x, mathType)
			{
				var returnValue = 0;
				switch( mathType)
					{
						case 'sine':
							{
								returnValue = ( 1 - Math.cos( Math.PI * x) ) / 2;
								break;
							}
						case 'liner':
							{
								returnValue = x;
								break;
							}	
					}
				return returnValue;
			}
		self.clearEventListener = function()
			{
				self.listenerCallBackStack['frame'].length = 0;
				self.listenerCallBackStack['play'].length = 0;
				self.listenerCallBackStack['pause'].length = 0;
				self.listenerCallBackStack['stop'].length = 0;
				self.listenerCallBackStack['goon'].length = 0;
			}
		self.addEventListener = function( eventString, callBackFunction, useCapture)
			{
				useCapture = useCapture ? useCapture : false;
				self.listenerCallBackStack[eventString].push( callBackFunction);
			}
		self.removeEventListener = function( eventString, callBackFunction)
			{
				var removeIndex = self.listenerCallBackStack[eventString].lastIndexOf( callBackFunction);
				var tmpArray = Array();
				for( var index in self.listenerCallBackStack[eventString] )
					{
						if( index != removeIndex )
							{
								tmpArray.push( self.listenerCallBackStack[eventString][index]);
							}
					}
				self.listenerCallBackStack[eventString] = tmpArray;
			}
		self.executeCallBack = function ( functionArray)
			{
				for( var index in functionArray )
					{
						functionArray[index](self);
					}
			}
	}