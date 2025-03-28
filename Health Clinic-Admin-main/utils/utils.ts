
export const getAge = (dateOfBirth: string) => {
      const birth = new Date(dateOfBirth);
      const today = new Date();
      return today.getFullYear() - birth.getFullYear();
    }