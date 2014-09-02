class User < ActiveRecord::Base
    validates :registration_number, presence: true, uniqueness: true
    validates :name, presence: true
    validates :lastname, presence: true
    validates :email, presence: true
end
