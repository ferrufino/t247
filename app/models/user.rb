# Model User
# Table users
# Fields     id:integer, registration_number:string, email:string, name:string,
#            lastname:string, admin:boolean, teacher:boolean,
#            created_at:datetime, updated_at:datetime, password_digest:string,
#            remember_digest:string
class User < ActiveRecord::Base
  attr_accessor :remember_token
  has_secure_password

  validates :registration_number, presence: true, uniqueness: true
  validates :name, presence: true
  validates :lastname, presence: true
  validates :email, presence: true
  validates :password, presence: true, on: :create

  def User.digest(string)
    cost = ActiveModel::SecurePassword.min_cost ? BCrypt::Engine::MIN_COST :
                                                  BCrypt::Engine.cost
    BCrypt::Password.create(string, cost: cost)
  end

  # Returns a random token.
  def User.new_token
    SecureRandom.urlsafe_base64
  end

  # Remembers a user in the database for use in persistent sessions.
  def remember
    self.remember_token = User.new_token
    update_attribute(:remember_digest, User.digest(remember_token))
  end

  # Returns true if the given token matches the digest.
  def authenticated?(remember_token)
    BCrypt::Password.new(remember_digest).is_password?(remember_token)
  end

  # Forgets a user.
  def forget
    update_attribute(:remember_digest, nil)
  end
end
