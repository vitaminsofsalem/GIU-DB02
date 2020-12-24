USE GIUERA

EXEC studentRegister 
@first_name="merna",
@last_name="michel",
@password=​'merna',
@email=​'​m@mail.com​',
@Gender​=1,
​@address​='nasr city'


EXEC studentRegister 
@first_name="sergey",
@last_name="urgov",
@password=​'490430fsavkjfv',
@email=​'serg2006@mail.ru',
@Gender​=0,
​@address​='nec. st'

SELECT * FROM Student S JOIN Users U ON s.id=U.ID

EXEC instructorRegister 
@first_name="Rana",
@last_name="Magdy",
@password=​'rana',
@email=​'rana@mail.com'​,
@Gender​=1,
​@address​='Cairo'


DECLARE @success BIT
DECLARE @type BIT

EXEC userLogin @id=1,@password='merna',@success = @success OUTPUT,@type = @type OUTPUT

PRINT @success
PRINT @type
