describe('domit specs', function() {

	// ====================================================================================
	// ====================================================================================
	describe('utilities', function(){

		// ====================================================================================
		describe('event', function(){

			it('should create a native event', function(){
				var result = domit.event('click'),
					compare = 'object';
				
				expect(result).toBeDefined();
				expect(typeof result).toBe(compare);
				expect(result.type).toBe('click');
			});

			it('should create a custom event', function(){
				var result = domit.event('impromptu:test'),
					compare = 'object';
				
				expect(result).toBeDefined();
				expect(typeof result).toBe(compare);
				expect(result.type).toBe('impromptu:test');
			});

			it('should attach data to an event', function(){
				var result = domit.event('impromptu:test', {test1: 'foobar'}),
					compare = 'foobar';
				
				expect(result.test1).toBe(compare);
			});
		});

		// ====================================================================================
		describe('query', function(){
			beforeEach(function(){
				$('body').append('<div id="dummyels" style="display:none">'+
					'<form action="" method="post" class="dummyels-form">'+
						'<label class="field"><input type="text" name="test1" value="test val 1"></label>'+
						'<label class="field"><input type="password" name="test2" value="test val 2"></label>'+
						'<label class="field"><input type="file" name="test3"></label>'+
						'<label class="field"><input type="checkbox" name="test4" value="test val 4 - a"></label>'+
						'<label class="field"><input type="checkbox" name="test4" value="test val 4 - b" checked></label>'+
						'<label class="field"><input type="checkbox" name="test4" value="test val 4 - c"></label>'+
						'<label class="field"><input type="checkbox" name="test4" value="test val 4 - d" checked></label>'+
						'<label class="field"><input type="checkbox" name="test4" value="test val 4 - e"></label>'+
						'<label class="field"><input type="radio" name="test5" value="test val 5 - a"></label>'+
						'<label class="field"><input type="radio" name="test5" value="test val 5 - b" checked></label>'+
						'<label class="field"><input type="radio" name="test5" value="test val 5 - c"></label>'+
						'<label class="field"><textarea name="test6">test val 6</textarea></label>'+
						'<label class="field">'+
							'<select name="test7">'+
								'<option value="test val 7 - a">'+
								'<option value="test val 7 - b">'+
								'<option value="test val 7 - c" selected>'+
							'</select>'+
						'</label>'+
						'<label class="field">'+
							'<select name="test8" multiple>'+
								'<option value="test val 8 - a">'+
								'<option value="test val 8 - b" selected>'+
								'<option value="test val 8 - c" selected>'+
							'</select>'+
						'</label>'+
					'</form>'+
				'</div>');
			});
			afterEach(function(){
				$('#dummyels').remove();
			});

			// ====================================================================================
			describe('constructor', function(){

				it('should find elements with a css selector', function(){
					var result = domit.query('#dummyels'),
						compare = 1;
					
					expect(result).toBeDefined();
					expect(result.length).toBe(compare);
				});

				it('should accept a single Node', function(){
					var result = domit.query(document.getElementById('dummyels')),
						compare = 1;
					
					expect(result.length).toBe(compare);
				});

				it('should accept a NodeList', function(){
					var result = domit.query(document.getElementById('dummyels').querySelectorAll('label')),
						compare = 14;
					
					expect(result.length).toBe(compare);
				});

				it('should accept an html string and build a document fragment', function(){
					var result = domit.query('<span>foo</span><span>bar</span><div>foobar</div>'),
						compare = 3;
					
					expect(result.length).toBe(compare);
					expect(result.nodes.length).toBe(compare);
				});
			});

			// ====================================================================================
			describe('find', function(){

				it('should find elements', function(){
					var result = domit.query('#dummyels').find('label'),
						compare = 14;
					
					expect(result.length).toBe(compare);
				});
			});

			// ====================================================================================
			describe('each', function(){
				
				it('should return a result set', function(){
					var result = 0,
						compare = 14,
						els = domit.query('#dummyels form label').each(function(){ result++; });
										
					expect(els.length).toBe(compare);
				});

				it('should loop every over every found element', function(){
					var result = 0,
						compare = 14;
					
					domit.query('#dummyels form label').each(function(){ result++; });
										
					expect(result).toBe(compare);
				});
			});

			// ====================================================================================
			describe('attach', function(){

				it('should append elements to a parent', function(){
					var parent = document.getElementById('dummyels'),
						result = domit.query('<span>test append</span>').attach(parent, 'append'),
						compare = parent.lastChild;

					expect(result.nodes[0]).toBe(compare);
				});

				it('should append elements to a parent', function(){
					var parent = document.getElementById('dummyels'),
						result = domit.query('<span>test append</span>').attach(parent, 'prepend'),
						compare = parent.firstChild;

					expect(result.nodes[0]).toBe(compare);
				});

			});

			// ====================================================================================
			describe('data', function(){
				
				it('should return a result set', function(){
					var compare = 14,
						els = domit.query('#dummyels form label').data({ test: '1234' });
										
					expect(els.length).toBe(compare);
				});

				it('should set a data attribute', function(){
					
					domit.query('#dummyels form label').data({ test: 'asdf' });
					
					var result = document.querySelector('#dummyels form label').getAttribute('data-test'),
						compare = 'asdf';

					expect(result).toBe(compare);
				});

				it('should get a data attribute', function(){

					document.querySelector('#dummyels form label').setAttribute('data-test', 'asdf');

					var compare = 'asdf',
						result = domit.query('#dummyels form label').data('test');
					

					expect(result).toBe(compare);
				});
			});

			// ====================================================================================
			describe('css', function(){
				
				it('should return a result set', function(){
					var compare = 14,
						els = domit.query('#dummyels form label').css({ color: 'rgb(255, 0, 0)' });
										
					expect(els.length).toBe(compare);
				});

				it('should set a css property', function(){
					
					domit.query('#dummyels form label').css({ color: 'rgb(255, 0, 0)' });
					
					var result = document.querySelector('#dummyels form label').style.color,
						compare = 'rgb(255, 0, 0)';

					expect(result).toBe(compare);
				});

				it('should get a css property', function(){

					document.querySelector('#dummyels form label').style.color = 'rgb(255, 0, 0)';

					var compare = 'rgb(255, 0, 0)',
						result = domit.query('#dummyels form label').css('color');
					

					expect(result).toBe(compare);
				});
			});

			// ====================================================================================
			describe('cls', function(){
				
				it('should find the class name', function(){
					var compare = true,
						result = domit.query('#dummyels form label').cls('has', 'field');
										
					expect(result).toBe(compare);
				});

				it('should not find the class name', function(){
					var compare = false,
						result = domit.query('#dummyels form label').cls('has', 'foobar');
										
					expect(result).toBe(compare);
				});

				it('should add the class to the elemnts', function(){
					var compare = true,
						els = domit.query('#dummyels form label').cls('add', 'foobar'),
						result = els.cls('has', 'foobar');
									
					expect(result).toBe(compare);
				});

				it('should remove the class to the elemnts', function(){
					var compare = false,
						els = domit.query('#dummyels form label').cls('remove', 'field'),
						result = els.cls('has', 'field');
									
					expect(result).toBe(compare);
				});	
			});

			// ====================================================================================
			describe('animate', function(){
				describe('with Imprompt.fx false', function(){

					beforeEach(function(){
						domit.fx = false;
					});

					afterEach(function(){
						domit.fx = true;
					});

					it('should set css properties', function(){
						
						domit.query('#dummyels form label').animate({ width: 200, opacity: 0.5 }, 0);
						
						var result = document.querySelector('#dummyels form label').style.opacity,
							compare = '0.5';

						expect(result).toBe(compare);
					});
				});

				describe('with Imprompt.fx true', function(){

					beforeEach(function(done){
						domit.query('#dummyels form label').animate({ width: 200, opacity: 0.5 }, 100, function(){ done(); });
					});

					it('should set css properties', function(){
						var result = document.querySelector('#dummyels form label').style.opacity,
							compare = '0.5';

						expect(result).toBe(compare);
					});
				});
			});

			// ====================================================================================
			describe('serialize', function(){
				
				it('should return an object with selected values', function(){
					var compare = {
							test1: 'test val 1',
							test2: 'test val 2',
							test3: '',
							test4: ['test val 4 - b','test val 4 - d'],
							test5: 'test val 5 - b',
							test6: 'test val 6',
							test7: 'test val 7 - c',
							test8: ['test val 8 - b','test val 8 - c']
						},
						result = domit.query('#dummyels form').serialize();
										
					expect(result).toEqual(compare);
				});

			});

			// ====================================================================================
			describe('on', function(){

				describe('add native event', function(){
					var spyEventCalled;

					beforeEach(function(done){
						spyEventCalled = false;
						
						domit.query('body').on('click', function(){ spyEventCalled = true; done(); });
						
						document.body.dispatchEvent(domit.event('click'));
					});

					it('should fire event', function(){
						expect(spyEventCalled).toBe(true);
					});
				});

				describe('add custom event', function(){
					var spyEventCalled;

					beforeEach(function(done){
						spyEventCalled = false;
						
						domit.query('body').on('impromptu:test', function(){ spyEventCalled = true; done(); });
						
						document.body.dispatchEvent(domit.event('impromptu:test'));
					});

					it('should fire event', function(){
						expect(spyEventCalled).toBe(true);
					});
				});
			});

			// ====================================================================================
			describe('off', function(){

				describe('remove native event', function(){
					var spyEventCalled;

					beforeEach(function(done){
						spyEventCalled = false;
						var evtfn = function(){ spyEventCalled = true; done(); };

						domit.query('body').on('click', evtfn);

						domit.query('body').off('click', evtfn);
						
						document.body.dispatchEvent(domit.event('click'));

						// since it should haven been called and should happen quickly, end this test
						setTimeout(function(){ if(!spyEventCalled){ done(); }}, 10);
					});

					it('should not fire event', function(){
						expect(spyEventCalled).not.toBe(true);
					});
				});

				describe('remove custom event', function(){
					var spyEventCalled;

					beforeEach(function(done){
						spyEventCalled = false;
						var evtfn = function(){ spyEventCalled = true; done(); };

						domit.query('body').on('impromptu:test', evtfn);

						domit.query('body').off('impromptu:test', evtfn);
						
						document.body.dispatchEvent(domit.event('impromptu:test'));

						// since it should haven been called and should happen quickly, end this test
						setTimeout(function(){ if(!spyEventCalled){ done(); }}, 10);
					});

					it('should not fire event', function(){
						expect(spyEventCalled).not.toBe(true);
					});
				});

			});

			// ====================================================================================
			describe('trigger', function(){
				describe('emit native event', function(){
					var spyEventCalled;

					beforeEach(function(done){
						spyEventCalled = false;
						
						domit.query('body').on('click', function(){ spyEventCalled = true; done(); });
						
						domit.query('body').trigger('click');
					});

					it('should fire event', function(){
						expect(spyEventCalled).toBe(true);
					});
				});

				describe('emit custom event', function(){
					var spyEventCalled;

					beforeEach(function(done){
						spyEventCalled = false;
						
						domit.query('body').on('impromptu:test', function(){ spyEventCalled = true; done(); });
						
						domit.query('body').trigger(domit.event('impromptu:test'));
					});

					it('should fire event', function(){
						expect(spyEventCalled).toBe(true);
					});
				});
			});
		});

	});
});
