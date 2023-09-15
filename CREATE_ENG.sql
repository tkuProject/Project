CREATE TABLE Shopping_Platform(
sNo int not null AUTO_INCREMENT,
sName VARCHAR(15) not null,
sImg_Site VARCHAR(150) not null,
PRIMARY KEY(sNo)
);


CREATE TABLE Credit_Card(
Card_No int not null AUTO_INCREMENT,
bank varchar(6) not null,
Card_Name varchar(20) not null,
Img_Site varchar(290) not null,
application_link varchar(100) not null,
annual_fee varchar(100) not null,
revolving_interest_rates varchar(70) null,
handling_fee varchar(70) null,
application_conditions varchar(50) null,
card_issuer varchar(20) null,
discount_information varchar(550) not null,
PRIMARY KEY(Card_No)
);

CREATE TABLE discount_description(
dNo int not null AUTO_INCREMENT,
Cash_Discount int null,
Cash_Discount_Percent DECIMAL(4,3) null,
Card_Reward int null,
Card_Reward_Percent DECIMAL(3,2) null,
Shopping_Platform_Reward int null,
Shopping_Platform_Reward_Percent DECIMAL(3,2) null,
Reward_upper_limit int  null, 
dNote varchar(120) null,
PRIMARY KEY (dNo)

);

CREATE TABLE Condition_of_Use(
uNo int not null AUTO_INCREMENT,
single_consumption_threshold int null,
single_installments_threshold int null,
cumulative_installments_threshold int null ,
specific_duration_start datetime null,
specific_duration_end datetime null,
bank_name varchar(10) null,
dCard_issuer varchar(20) null,
dNo int not null,
sNo int not null,
cNote varchar(120) null,
PRIMARY KEY (uNo),
FOREIGN KEY (dNo) REFERENCES discount_description(dNo)  on update cascade,
FOREIGN KEY (sNo) REFERENCES Shopping_Platform(sNo) on update cascade
);


CREATE TABLE `include`(
dNo int not null,
PRIMARY KEY (dNo),
FOREIGN KEY (dNo) REFERENCES discount_description(dNo) on update cascade
);

CREATE TABLE `member`(
mAccount varchar(24) not null,
mPassword varchar(64) not null,
PRIMARY KEY (mAccount)
);


CREATE TABLE collect_card(
Card_No int not null,
mAccount varchar(24) not null,
PRIMARY KEY (Card_No, mAccount),
FOREIGN KEY (Card_No) REFERENCES Credit_Card(Card_No) on update cascade,
FOREIGN KEY (mAccount) REFERENCES member(mAccount) on update cascade
);

CREATE TABLE Charts(
Category_No int not null AUTO_INCREMENT,
Category_Name varchar(10) not null, 
PRIMARY KEY (Category_No)
);

CREATE TABLE Ranking(
Card_No int not null ,
Category_No int not null,
weight_score DECIMAL(4,2) null,
PRIMARY KEY (Card_No, Category_No),
FOREIGN KEY (Card_No) REFERENCES Credit_Card(Card_No) on update cascade,
FOREIGN KEY (Category_No) REFERENCES Charts(Category_No) on update cascade
);

CREATE TABLE Keyword(
kNo int not null AUTO_INCREMENT,
kName varchar(10),
PRIMARY KEY(kNo)
);

CREATE TABLE conform(
kNo int not null ,
Card_No int not null ,
PRIMARY KEY(kNo, Card_No),
FOREIGN KEY (Card_No) REFERENCES Credit_Card(Card_No) on update cascade,
FOREIGN KEY (kNo) REFERENCES Keyword(kNo) on update cascade
);

CREATE TABLE `Notification`(
nNo int not null AUTO_INCREMENT,
nLink varchar(50) not null,
nDate DATE not null,
Card_No int not null,
PRIMARY KEY (nNo),
FOREIGN KEY (Card_No) REFERENCES Credit_Card(Card_No)
);

CREATE TABLE collecting_notification(
mAccount varchar(24) not null,
nNo int not null,
discount_information varchar(200) not null,
PRIMARY KEY (mAccount, nNo),
FOREIGN KEY (mAccount) REFERENCES member(mAccount),
FOREIGN KEY (nNo) REFERENCES Notification(nNo)
);

CREATE TABLE Precautions(
dNo int not null,
Precautions_content varchar(500) not null,
important_precautions_content varchar(150) not null DEFAULT(''),
pNote varchar(100) not null,
PRIMARY KEY (dNo, Precautions_content, important_precautions_content, pNote)
);

CREATE TABLE day_of_the_week(
uNo int not null,
the_day date not null,
wNote varchar(200) not null,
PRIMARY KEY (uNo, the_day, wNote)
);

CREATE TABLE installments_limit(
uNo int not null,
limit_content int not null,
iNote varchar(200) not null,
PRIMARY KEY(uNo, limit_content, iNote)
);

CREATE TABLE Condition_Card_Nos(
uNo int not null, 
Card_No int not null,
PRIMARY KEY (uNo, Card_No),
Foreign Key (uNo)  REFERENCES Condition_of_Use(uNo),
Foreign Key (Card_No) REFERENCES Credit_Card(Card_No)
);