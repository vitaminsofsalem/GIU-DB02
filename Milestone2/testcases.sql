
USE GIUERA

EXEC studentRegister 
@first_name="merna",
@last_name="michel",
@password=​'merna',
@email=​'​m@mail.com​',
@Gender​=1,
​@address​='nasr city'


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

PRINT N'success = ' +  CAST(@success as varchar(1))
PRINT N'type = ' +  CAST(@type as varchar(1))

EXEC userLogin @id=3,@password='rana',@success = @success OUTPUT,@type = @type OUTPUT

PRINT N'success = ' +  CAST(@success as varchar(1))
PRINT N'type = ' +  CAST(@type as varchar(1))

EXEC addMobile @id=1,@mobile_number='01299969493';

