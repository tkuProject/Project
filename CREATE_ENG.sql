CREATE TABLE Shopping_Platform(
sNo int not null AUTO_INCREMENT,
sName VARCHAR(7) not null,
sImg_Site VARCHAR(100) not null,
PRIMARY KEY(sNo)
);


CREATE TABLE Points(
pNo int not null AUTO_INCREMENT,
pType varchar(7) not null,
pAmount int null,
PRIMARY KEY (pNo)
);

CREATE TABLE Credit_Card(
Card_No int not null AUTO_INCREMENT,
Card_Name varchar(10) not null,
bank varchar(6) not null,
link  varchar(50) not null,
application_link varchar(50) not null,
discount_information varchar(200) not null,
fee varchar(100) not null,
Img_Site varchar(100) not null,
PRIMARY KEY(Card_No)
);

CREATE TABLE Condition_of_Use(
uNo int not null AUTO_INCREMENT,
Single_consumption_threshold int null,
single_installments_threshold int null,
cumulative_installments_threshold int null ,
specific_duration_consumption varchar(20) null,
bank_name varchar(7) null,
Card_No int null,
PRIMARY KEY (uNo),
FOREIGN KEY (Card_No) REFERENCES Credit_Card(Card_No) on delete set null on update cascade
);

CREATE TABLE discount_description(
dNo int not null AUTO_INCREMENT,
Cash_Discount int null,
Cash_Discount_Percent int null,
pNo int null,
Card_Reward int null,
Card_Reward_Percent int null,
sNo int not null,
uNo int not null ,
PRIMARY KEY (dNo),
FOREIGN KEY (sNo) REFERENCES Shopping_Platform(sNo) on update cascade,
FOREIGN KEY (pNo) REFERENCES Points(pNo) on update cascade,
FOREIGN KEY (uNo) REFERENCES Condition_of_Use(uNo) on update cascade
);

CREATE TABLE Other(
dNo int not null ,
other_discount varchar(100),
PRIMARY KEY (dNo),
FOREIGN KEY (dNo) REFERENCES discount_description(dNo) on update cascade
);

CREATE TABLE `include`(
dNo int not null,
pNo int not null,
PRIMARY KEY (dNo, pNo),
FOREIGN KEY (dNo) REFERENCES discount_description(dNo) on update cascade,
FOREIGN KEY (pNo) REFERENCES Points(pNo) on update cascade
);

CREATE TABLE member(
mAccount varchar(24) not null,
mPassword varchar(64) not null,
email varchar(30) null,
collect_information varchar(100) null,
PRIMARY KEY (mAccount)
);


CREATE TABLE collect_card(
Card_No int not null,
mAccount varchar(24) not null,
Card_Name varchar(10) not null,
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
Ranks int null,
PRIMARY KEY (Card_No, Category_No),
FOREIGN KEY (Card_No) REFERENCES Credit_Card(Card_No) on update cascade,
FOREIGN KEY (Category_No) REFERENCES Charts(Category_No) on update cascade
);

CREATE TABLE Keyword(
kNo int not null AUTO_INCREMENT,
Category_No int not null,
kName varchar(10),
Category_Name varchar(10) not null, 
PRIMARY KEY(kNo, Category_No)
);

CREATE TABLE conform(
kNo int not null ,
Category_No int not null ,
Card_No int not null ,
PRIMARY KEY(kNo, Category_No, Card_No),
FOREIGN KEY (Card_No) REFERENCES Credit_Card(Card_No) on update cascade,
FOREIGN KEY (kNo, Category_No) REFERENCES Keyword(kNo, Category_No) on update cascade
);

CREATE TABLE `Notification`(
nNo int not null AUTO_INCREMENT,
nContent varchar(150) not null,
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
